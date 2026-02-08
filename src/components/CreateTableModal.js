import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { getBoardGames, searchGames, getCachedGame, persistGameData } from '../services/gameService';
import { PLACE_OPTIONS } from '../constants';

const CreateTableModal = ({
  isOpen,
  onClose,
  tableForm,
  setTableForm,
  onSubmit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchGames(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
        if (results.length === 0) {
          setSearchError('No games found. Try a different search term.');
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Failed to search. Please try again.');
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  if (!isOpen) return null;

  const BOARD_GAMES = getBoardGames();

  // Determine which games to display
  const displayedGames = searchQuery.trim().length >= 2 ? searchResults : BOARD_GAMES;

  const firstGameId = tableForm.boardGames[0];
  const firstGame = firstGameId ? (getCachedGame(firstGameId) || BOARD_GAMES.find(g => g.id === firstGameId)) : null;
  const gameImage = firstGame ? (
    (firstGame.thumbnailUrl && typeof firstGame.thumbnailUrl === 'string' && firstGame.thumbnailUrl.length > 0) ? firstGame.thumbnailUrl :
    (firstGame.imageUrl && typeof firstGame.imageUrl === 'string' && firstGame.imageUrl.length > 0) ? firstGame.imageUrl :
    null
  ) : null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        overflow: 'hidden',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          background: gameImage 
            ? `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%), url('${gameImage}')` 
            : 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '2rem',
          minHeight: '150px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          color: 'white'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Create Gaming Session</h2>
            {firstGame && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem', opacity: 0.9 }}>
                {firstGame.image} {firstGame.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: 'white',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={onSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Session Title *</label>
              <input
                type="text"
                required
                value={tableForm.title}
                onChange={(e) => setTableForm({...tableForm, title: e.target.value})}
                placeholder="e.g., Saturday Night Catan"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Players *</label>
                <input
                  type="number"
                  required
                  min="2"
                  max="10"
                  value={tableForm.numPlayers}
                  onChange={(e) => setTableForm({...tableForm, numPlayers: parseInt(e.target.value)})}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Place *</label>
                <select
                  required
                  value={tableForm.place}
                  onChange={(e) => setTableForm({...tableForm, place: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '2px solid #e0e0e0', 
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                >
                  {PLACE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={tableForm.dateTime}
                onChange={(e) => setTableForm({...tableForm, dateTime: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '2px solid #e0e0e0', 
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Select Games</label>

              {/* Search Input */}
              <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={20}
                    style={{
                      position: 'absolute',
                      left: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#999'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search BoardGameGeek..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                {isSearching && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#666',
                    marginTop: '0.5rem',
                    fontStyle: 'italic'
                  }}>
                    Searching BoardGameGeek...
                  </div>
                )}
                {searchError && (
                  <div style={{
                    fontSize: '0.85rem',
                    color: '#ff6b6b',
                    marginTop: '0.5rem'
                  }}>
                    {searchError}
                  </div>
                )}
                {searchQuery.trim().length >= 2 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      fontSize: '0.85rem',
                      color: '#4ECDC4',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      marginTop: '0.25rem',
                      padding: '0.25rem 0',
                      fontWeight: '600',
                      fontFamily: 'inherit'
                    }}
                  >
                    ← Back to default games
                  </button>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem',
                maxHeight: '200px',
                overflow: 'auto',
                padding: '0.5rem',
                background: '#f9f9f9',
                borderRadius: '12px'
              }}>
                {displayedGames.map(game => {
                  const isSelected = tableForm.boardGames.includes(game.id);
                  return (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => {
                        const games = isSelected
                          ? tableForm.boardGames.filter(g => g !== game.id)
                          : [...tableForm.boardGames, game.id];
                        setTableForm({...tableForm, boardGames: games});
                        // Persist the game data to survive page refresh
                        if (!isSelected) {
                          persistGameData(game);
                        }
                      }}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid',
                        borderColor: isSelected ? '#4ECDC4' : '#e0e0e0',
                        background: isSelected ? '#4ECDC4' : 'white',
                        color: isSelected ? 'white' : '#666',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {game.thumbnailUrl ? (
                          <img
                            src={game.thumbnailUrl}
                            alt={game.name}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              objectFit: 'cover'
                            }}
                          />
                        ) : (
                          <span>{game.image}</span>
                        )}
                        <span style={{ flex: 1, fontWeight: '700' }}>{game.name}</span>
                      </div>
                      {game.yearPublished && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                          {game.yearPublished}
                        </div>
                      )}
                      {(game.minPlayers || game.maxPlayers) && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                          👥 {game.minPlayers}-{game.maxPlayers} players
                        </div>
                      )}
                      {game.playingTime && (
                        <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                          ⏱ {game.playingTime} min
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Create Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTableModal;
