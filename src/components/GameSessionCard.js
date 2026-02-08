import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getBoardGames, getCachedGame } from '../services/gameService';

const GameSessionCard = ({ 
  table, 
  currentUserId, 
  onJoinTable, 
  onLeaveTable, 
  getUserById,
  isMyTables 
}) => {
  const BOARD_GAMES = getBoardGames();
  const spotsLeft = table.numPlayers - table.participants.length;
  const isCreator = table.creatorId === currentUserId;
  const firstGame = table.boardGames.length > 0 ? (getCachedGame(table.boardGames[0]) || BOARD_GAMES.find(g => g.id === table.boardGames[0])) : null;
  
  // Get a valid image URL - prefer imageUrl, then thumbnailUrl, fallback to null if neither exists or is invalid
  const gameImage = firstGame ? (
    (firstGame.imageUrl && typeof firstGame.imageUrl === 'string' && firstGame.imageUrl.length > 0) ? firstGame.imageUrl :
    (firstGame.thumbnailUrl && typeof firstGame.thumbnailUrl === 'string' && firstGame.thumbnailUrl.length > 0) ? firstGame.thumbnailUrl :
    null
  ) : null;
  const creator = getUserById(table.creatorId);

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = isMyTables ? 'translateY(-8px) rotate(1deg)' : 'translateY(-8px) rotate(-1deg)';
        const color = isMyTables ? 'rgba(255, 107, 157, 0.3)' : 'rgba(67, 233, 123, 0.3)';
        e.currentTarget.style.boxShadow = `0 12px 40px ${color}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
      }}
    >
      {gameImage ? (
        <div style={{
          position: 'relative',
          height: '200px',
          overflow: 'hidden'
        }}>
          <img 
            src={gameImage} 
            alt={firstGame.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
            padding: '2rem 1.5rem 1rem 1.5rem',
            color: 'white'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>{table.title}</h3>
            {isCreator && (
              <div style={{ 
                display: 'inline-block',
                background: 'rgba(255,255,255,0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                fontWeight: '600'
              }}>
                👑 Host
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          background: isMyTables ? 'linear-gradient(135deg, #FEC163 0%, #FFB88C 100%)' : 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
          padding: '1.5rem',
          color: 'white'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {firstGame ? firstGame.image : '🎲'}
          </div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>{table.title}</h3>
          {isMyTables ? (
            isCreator && (
              <div style={{ 
                display: 'inline-block',
                background: 'rgba(255,255,255,0.3)',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                marginTop: '0.5rem',
                fontWeight: '600'
              }}>
                👑 Host
              </div>
            )
          ) : (
            <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>
              Hosted by {creator?.name || 'Unknown'}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '0.5rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <Calendar size={16} />
            <span>{new Date(table.dateTime).toLocaleString()}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '0.5rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <MapPin size={16} />
            <span>{table.place}</span>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <Users size={16} />
            <span>
              {table.participants.length}/{table.numPlayers} players
              {!isMyTables && ` • ${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>

        {table.boardGames.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem', fontWeight: '600' }}>
              GAMES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {table.boardGames.map(gameId => {
                const game = getCachedGame(gameId) || BOARD_GAMES.find(g => g.id === gameId);
                return game ? (
                  <div
                    key={gameId}
                    style={{
                      padding: '0.75rem',
                      background: '#f9f9f9',
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      {game.thumbnailUrl ? (
                        <img
                          src={game.thumbnailUrl}
                          alt={game.name}
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '1.5rem' }}>{game.image}</span>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '0.9rem',
                          fontWeight: '700',
                          color: '#333'
                        }}>
                          {game.name}
                          {game.yearPublished && (
                            <span style={{
                              fontSize: '0.8rem',
                              fontWeight: '500',
                              color: '#999',
                              marginLeft: '0.5rem'
                            }}>
                              ({game.yearPublished})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced game metadata */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      fontSize: '0.75rem',
                      color: '#666'
                    }}>
                      {game.minPlayers && game.maxPlayers && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>👥</span>
                          <span>{game.minPlayers}-{game.maxPlayers} players</span>
                        </div>
                      )}
                      {game.playingTime && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>⏱</span>
                          <span>{game.playingTime} min</span>
                        </div>
                      )}
                      {game.complexity && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>🎯</span>
                          <span>Complexity: {game.complexity.toFixed(1)}/5</span>
                        </div>
                      )}
                      {game.averageRating && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>⭐</span>
                          <span>{game.averageRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {isMyTables && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem', fontWeight: '600' }}>
              PLAYERS
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {table.participants.map(userId => {
                const user = getUserById(userId);
                return user ? (
                  <div
                    key={userId}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: '#4ECDC4',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    {user.name}
                  </div>
                ) : null;
              })}
              {Array.from({ length: spotsLeft }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  style={{
                    padding: '0.5rem 0.75rem',
                    background: '#f0f0f0',
                    color: '#999',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    border: '2px dashed #ddd'
                  }}
                >
                  Open
                </div>
              ))}
            </div>
          </div>
        )}

        {spotsLeft > 0 && spotsLeft === 1 && isMyTables && (
          <div style={{
            background: '#fff4e6',
            color: '#ff9800',
            padding: '0.75rem',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '700',
            textAlign: 'center'
          }}>
            🔥 Only 1 spot left!
          </div>
        )}

        {isMyTables && !isCreator && (
          <button
            onClick={() => onLeaveTable(table.id)}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'white',
              color: '#e53e3e',
              border: '2px solid #e53e3e',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '0.5rem',
              fontFamily: 'inherit'
            }}
          >
            Leave Session
          </button>
        )}

        {!isMyTables && (
          spotsLeft > 0 ? (
            <button
              onClick={() => onJoinTable(table.id)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Join Session
            </button>
          ) : (
            <div style={{
              width: '100%',
              padding: '0.75rem',
              background: '#f0f0f0',
              color: '#999',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              textAlign: 'center'
            }}>
              Session Full
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GameSessionCard;
