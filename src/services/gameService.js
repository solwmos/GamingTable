const FALLBACK_GAMES = [
  { id: 1, name: 'Catan', category: 'Strategy', image: '🏝️', imageUrl: null, bggId: 13 },
  { id: 2, name: 'Ticket to Ride', category: 'Family', image: '🚂', imageUrl: null, bggId: 9209 },
  { id: 3, name: 'Pandemic', category: 'Cooperative', image: '🦠', imageUrl: null, bggId: 30549 },
  { id: 4, name: 'Carcassonne', category: 'Strategy', image: '🏰', imageUrl: null, bggId: 822 },
  { id: 5, name: 'Codenames', category: 'Party', image: '🕵️', imageUrl: null, bggId: 178900 },
  { id: 6, name: 'Azul', category: 'Abstract', image: '🎨', imageUrl: null, bggId: 230802 },
  { id: 7, name: 'Splendor', category: 'Strategy', image: '💎', imageUrl: null, bggId: 148228 },
  { id: 8, name: 'Wingspan', category: 'Strategy', image: '🦅', imageUrl: null, bggId: 266192 },
];

const BGG_BEARER_TOKEN = process.env.REACT_APP_BGG_TOKEN || '';

let BOARD_GAMES = [];

// Game cache for searched games
const GAME_CACHE = new Map();

// Search results cache with TTL
const SEARCH_CACHE = new Map();
const SEARCH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Persistent storage key for selected games
const SELECTED_GAMES_STORAGE_KEY = 'selected-games-data';

// Pre-populate cache with fallback games
FALLBACK_GAMES.forEach(game => {
  GAME_CACHE.set(game.id, game);
  if (game.bggId) {
    GAME_CACHE.set(game.bggId.toString(), game);
  }
});

// Load persisted selected games into cache on initialization
const loadPersistedGames = () => {
  try {
    const stored = localStorage.getItem(SELECTED_GAMES_STORAGE_KEY);
    if (stored) {
      const games = JSON.parse(stored);
      games.forEach(game => {
        GAME_CACHE.set(game.id, game);
        if (game.bggId) {
          GAME_CACHE.set(game.bggId.toString(), game);
        }
      });
    }
  } catch (error) {
    console.warn('Error loading persisted games:', error);
  }
};

// Initialize cache with persisted games
loadPersistedGames();

// Parse search results XML to get basic game info
const parseSearchResults = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const items = xmlDoc.querySelectorAll('item[type="boardgame"]');

    const results = [];
    items.forEach(item => {
      const bggId = item.getAttribute('id');
      const nameElement = item.querySelector('name[type="primary"], name');
      const name = nameElement?.getAttribute('value') || nameElement?.textContent || 'Unknown';
      const yearElement = item.querySelector('yearpublished');
      const yearPublished = yearElement ? parseInt(yearElement.getAttribute('value')) : null;

      if (bggId && name) {
        results.push({ bggId, name, yearPublished });
      }
    });

    return results;
  } catch (error) {
    console.error('Error parsing search results:', error);
    return [];
  }
};

// Enhanced parser to extract detailed game information
const parseGameDetails = (xmlString) => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const gameElement = xmlDoc.querySelector('item');

    if (!gameElement) return null;

    const bggId = gameElement.getAttribute('id');

    // Get primary name
    const nameElement = gameElement.querySelector('name[type="primary"]') ||
                        gameElement.querySelector('name');
    const name = nameElement?.getAttribute('value') || nameElement?.textContent || 'Unknown';

    // Get images
    const imageUrl = gameElement.querySelector('image')?.textContent || null;
    const thumbnailUrl = gameElement.querySelector('thumbnail')?.textContent || null;

    // Get player counts
    const minPlayersElement = gameElement.querySelector('minplayers');
    const maxPlayersElement = gameElement.querySelector('maxplayers');
    const minPlayers = minPlayersElement ? parseInt(minPlayersElement.getAttribute('value')) : null;
    const maxPlayers = maxPlayersElement ? parseInt(maxPlayersElement.getAttribute('value')) : null;

    // Get playing time
    const playingTimeElement = gameElement.querySelector('playingtime');
    const playingTime = playingTimeElement ? parseInt(playingTimeElement.getAttribute('value')) : null;

    // Get year published
    const yearElement = gameElement.querySelector('yearpublished');
    const yearPublished = yearElement ? parseInt(yearElement.getAttribute('value')) : null;

    // Get ratings and complexity
    const ratingsElement = gameElement.querySelector('statistics ratings');
    let averageRating = null;
    let complexity = null;

    if (ratingsElement) {
      const avgElement = ratingsElement.querySelector('average');
      const weightElement = ratingsElement.querySelector('averageweight');

      averageRating = avgElement ? parseFloat(avgElement.getAttribute('value')) : null;
      complexity = weightElement ? parseFloat(weightElement.getAttribute('value')) : null;
    }

    return {
      bggId,
      name,
      imageUrl,
      thumbnailUrl,
      minPlayers,
      maxPlayers,
      playingTime,
      yearPublished,
      averageRating,
      complexity,
      category: 'Strategy' // Keep for backward compatibility
    };
  } catch (error) {
    console.error('Error parsing game details:', error);
    return null;
  }
};


// Search for games by name on BGG
export const searchGames = async (query) => {
  // Validate input
  if (!query || query.trim().length < 2) {
    return [];
  }

  const trimmedQuery = query.trim();

  // Check cache first
  const cacheKey = trimmedQuery.toLowerCase();
  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SEARCH_CACHE_TTL) {
    return cached.results;
  }

  try {
    // Step 1: Search for games by name
    const searchUrl = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(trimmedQuery)}&type=boardgame`;

    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: BGG_BEARER_TOKEN ? {
        'Authorization': `Bearer ${BGG_BEARER_TOKEN}`,
        'Accept': 'application/xml'
      } : {
        'Accept': 'application/xml'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!searchResponse.ok) {
      console.warn(`BGG search failed: ${searchResponse.status}`);
      return [];
    }

    const searchXml = await searchResponse.text();
    const searchResults = parseSearchResults(searchXml);

    if (searchResults.length === 0) {
      // Cache empty results too
      SEARCH_CACHE.set(cacheKey, { results: [], timestamp: Date.now() });
      return [];
    }

    // Limit to first 10 results to avoid overwhelming the API
    const limitedResults = searchResults.slice(0, 10);
    const bggIds = limitedResults.map(r => r.bggId);

    // Step 2: Fetch detailed information for these games
    // Add a small delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 200));

    const thingUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${bggIds.join(',')}&stats=1`;

    const thingResponse = await fetch(thingUrl, {
      method: 'GET',
      headers: BGG_BEARER_TOKEN ? {
        'Authorization': `Bearer ${BGG_BEARER_TOKEN}`,
        'Accept': 'application/xml'
      } : {
        'Accept': 'application/xml'
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!thingResponse.ok) {
      console.warn(`BGG thing fetch failed: ${thingResponse.status}`);
      return [];
    }

    const thingXml = await thingResponse.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(thingXml, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    const games = [];
    const timestamp = Date.now();

    items.forEach((item, index) => {
      const itemXml = new XMLSerializer().serializeToString(item);
      const gameDetails = parseGameDetails(`<?xml version="1.0" encoding="utf-8"?><items>${itemXml}</items>`);

      if (gameDetails) {
        // Generate a unique local ID
        const localId = timestamp + index;

        const game = {
          id: localId,
          ...gameDetails,
          // Use emoji fallback if no thumbnail
          image: gameDetails.name.charAt(0)
        };

        games.push(game);

        // Add to cache
        GAME_CACHE.set(localId, game);
        GAME_CACHE.set(gameDetails.bggId.toString(), game);
      }
    });

    // Cache the results
    SEARCH_CACHE.set(cacheKey, { results: games, timestamp: Date.now() });

    return games;
  } catch (error) {
    console.error('Error searching BGG:', error);
    return [];
  }
};

export const fetchBoardGames = async () => {
  try {
    const gameIds = [13, 9209, 30549, 822, 178900, 230802, 148228, 266192];
    
    if (!BGG_BEARER_TOKEN) {
      console.warn('BGG_BEARER_TOKEN not set. Using fallback games. Set REACT_APP_BGG_TOKEN environment variable.');
      BOARD_GAMES = FALLBACK_GAMES;
      return;
    }

    const games = [];
    
    for (let i = 0; i < gameIds.length; i++) {
      const gameId = gameIds[i];
      try {
        const response = await fetch(
          `https://boardgamegeek.com/xmlapi2/thing?id=${gameId}&images=1`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${BGG_BEARER_TOKEN}`,
              'Accept': 'application/xml'
            }
          }
        );

        if (!response.ok) {
          console.warn(`Failed to fetch game ${gameId}: ${response.status}`);
          continue;
        }

        const xmlText = await response.text();
        const gameData = parseGameDetails(xmlText);

        if (gameData) {
          const game = {
            id: i + 1,
            ...gameData,
            image: FALLBACK_GAMES[i]?.image || gameData.name.charAt(0)
          };
          games.push(game);
          // Add to cache
          GAME_CACHE.set(game.id, game);
          if (game.bggId) {
            GAME_CACHE.set(game.bggId.toString(), game);
          }
        }
      } catch (error) {
        console.warn(`Error fetching game ${gameId}:`, error);
      }
    }

    BOARD_GAMES = games.length > 0 ? games : FALLBACK_GAMES;
  } catch (error) {
    console.warn('Failed to fetch board games from BGG API, using fallback games:', error);
    BOARD_GAMES = FALLBACK_GAMES;
  }
};

export const getGameImage = (gameId) => {
  const game = BOARD_GAMES.find(g => g.id === gameId);
  return game ? (game.imageUrl || game.image) : '🎲';
};

export const getBoardGames = () => BOARD_GAMES;

export const getCachedGame = (id) => {
  // Try to find by local ID first
  let game = GAME_CACHE.get(id);
  if (game) return game;

  // Try to find by BGG ID
  game = GAME_CACHE.get(id.toString());
  if (game) return game;

  // Try to find in BOARD_GAMES array
  game = BOARD_GAMES.find(g => g.id === id || g.bggId === id || g.bggId === id.toString());
  if (game) return game;

  // Fallback to default games
  return FALLBACK_GAMES.find(g => g.id === id || g.bggId === id || g.bggId === id.toString());
};

// Save a game to persistent storage to ensure it survives page refresh
export const persistGameData = (game) => {
  try {
    // Get existing persisted games
    let persistedGames = [];
    const stored = localStorage.getItem(SELECTED_GAMES_STORAGE_KEY);
    if (stored) {
      persistedGames = JSON.parse(stored);
    }
    
    // Check if game already exists
    const gameExists = persistedGames.some(g => g.id === game.id);
    if (!gameExists) {
      persistedGames.push(game);
      localStorage.setItem(SELECTED_GAMES_STORAGE_KEY, JSON.stringify(persistedGames));
      
      // Also add to in-memory cache
      GAME_CACHE.set(game.id, game);
      if (game.bggId) {
        GAME_CACHE.set(game.bggId.toString(), game);
      }
    }
  } catch (error) {
    console.warn('Error persisting game data:', error);
  }
};
