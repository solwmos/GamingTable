import storage from "./storage";
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, X, Search, LogIn, UserPlus, Clock, Dice1, Home } from 'lucide-react';

// Simulated database using persistent storage
const DB = {
  async getUsers() {
    try {
      const result = await storage.get('users');
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  },
  async saveUsers(users) {
    await storage.set('users', JSON.stringify(users));
  },
  async getTables() {
    try {
      const result = await storage.get('gaming-tables');
      return result ? JSON.parse(result.value) : [];
    } catch {
      return [];
    }
  },
  async saveTables(tables) {
    await storage.set('gaming-tables', JSON.stringify(tables));
  },
  async getCurrentUser() {
    try {
      const result = await storage.get('current-user');
      return result ? JSON.parse(result.value) : null;
    } catch {
      return null;
    }
  },
  async setCurrentUser(user) {
    if (user) {
      await storage.set('current-user', JSON.stringify(user));
    } else {
      await storage.delete('current-user');
    }
  }
};

// Sample board games with BoardGameGeek IDs and direct image URLs
const BOARD_GAMES = [
  { id: 1, name: 'Catan', category: 'Strategy', image: '🏝️', bggId: 13, imageUrl: 'https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__imagepage/img/M_3Vg1j2HlKjdragx89rGJURN2s=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2419375.jpg' },
  { id: 2, name: 'Ticket to Ride', category: 'Family', image: '🚂', bggId: 9209, imageUrl: 'https://cf.geekdo-images.com/ZWJg0dCdrWff2-equally/img/RkeBCDlNB8tXuYjPdY9yuYUYao=/fit-in/900x600/filters:no_upscale():strip_icc()/pic66668.jpg' },
  { id: 3, name: 'Pandemic', category: 'Cooperative', image: '🦠', bggId: 30549, imageUrl: 'https://cf.geekdo-images.com/cTrAWasNHyKMcNs8Zrv5O7sKS6M=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1534148.jpg' },
  { id: 4, name: 'Carcassonne', category: 'Strategy', image: '🏰', bggId: 822, imageUrl: 'https://cf.geekdo-images.com/Z3upN53-fsVPUDimN9SpOA__imagepage/img/sT0kjr-Klona2rygvD8kURJgqdU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2337577.jpg' },
  { id: 5, name: 'Codenames', category: 'Party', image: '🕵️', bggId: 178900, imageUrl: 'https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__imagepage/img/rc_Do8f5v41nWEGcwHE1eKAkIfI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2582929.jpg' },
  { id: 6, name: 'Azul', category: 'Abstract', image: '🎨', bggId: 230802, imageUrl: 'https://cf.geekdo-images.com/aPSHJO0d0XOpQR5X-wJonw__imagepage/img/q4uWd6xPY6FPZ0kx2VDOxV0tPvs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3718275.jpg' },
  { id: 7, name: 'Splendor', category: 'Strategy', image: '💎', bggId: 148228, imageUrl: 'https://cf.geekdo-images.com/rwOMxx4q5yuElIvo-1-OFw__imagepage/img/YBEWL2ii90NLW3y39P-tvv4wCWs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1904079.jpg' },
  { id: 8, name: 'Wingspan', category: 'Strategy', image: '🦅', bggId: 266192, imageUrl: 'https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__imagepage/img/uIjeoKgHVnyRFEpdOWexEfG5s7Q=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4458123.jpg' },
];

const CATEGORIES = ['Strategy', 'Family', 'Cooperative', 'Party', 'Abstract'];

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [gamingTables, setGamingTables] = useState([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [loading, setLoading] = useState(true);

  // Registration form state
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    preferences: []
  });

  // Create table form state
  const [tableForm, setTableForm] = useState({
    title: '',
    numPlayers: 4,
    place: 'Indoor',
    dateTime: '',
    boardGames: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [loadedUser, loadedUsers, loadedTables] = await Promise.all([
      DB.getCurrentUser(),
      DB.getUsers(),
      DB.getTables()
    ]);
    setCurrentUser(loadedUser);
    setUsers(loadedUsers);
    setGamingTables(loadedTables);
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now().toString(),
      ...regForm,
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    await DB.saveUsers(updatedUsers);
    await DB.setCurrentUser(newUser);
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    setShowRegistration(false);
    setRegForm({ name: '', email: '', age: '', gender: '', preferences: [] });
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    const newTable = {
      id: Date.now().toString(),
      ...tableForm,
      creatorId: currentUser.id,
      participants: [currentUser.id],
      createdAt: new Date().toISOString()
    };
    const updatedTables = [...gamingTables, newTable];
    await DB.saveTables(updatedTables);
    setGamingTables(updatedTables);
    setShowCreateTable(false);
    setTableForm({ title: '', numPlayers: 4, place: 'Indoor', dateTime: '', boardGames: [] });
  };

  const handleJoinTable = async (tableId) => {
    const updatedTables = gamingTables.map(table => {
      if (table.id === tableId && !table.participants.includes(currentUser.id)) {
        return { ...table, participants: [...table.participants, currentUser.id] };
      }
      return table;
    });
    await DB.saveTables(updatedTables);
    setGamingTables(updatedTables);
  };

  const handleLeaveTable = async (tableId) => {
    const updatedTables = gamingTables.map(table => {
      if (table.id === tableId) {
        return { ...table, participants: table.participants.filter(id => id !== currentUser.id) };
      }
      return table;
    });
    await DB.saveTables(updatedTables);
    setGamingTables(updatedTables);
  };

  const handleLogout = async () => {
    await DB.setCurrentUser(null);
    setCurrentUser(null);
  };

  const getUserById = (userId) => users.find(u => u.id === userId);

  const myTables = gamingTables.filter(table => 
    table.participants.includes(currentUser?.id) || table.creatorId === currentUser?.id
  );

  const upcomingTables = gamingTables.filter(table => 
    new Date(table.dateTime) > new Date()
  ).sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)' }}>
        <div style={{ fontSize: '2rem', color: 'white', fontWeight: '700' }}>Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          transform: 'rotate(-1deg)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎲</div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 0.5rem 0',
              background: 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>The Gaming Table</h1>
            <p style={{ color: '#666', fontSize: '1.1rem', margin: 0 }}>Find players. Roll dice. Make friends.</p>
          </div>

          {showRegistration ? (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Name *</label>
                <input
                  type="text"
                  required
                  value={regForm.name}
                  onChange={(e) => setRegForm({...regForm, name: e.target.value})}
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

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Email *</label>
                <input
                  type="email"
                  required
                  value={regForm.email}
                  onChange={(e) => setRegForm({...regForm, email: e.target.value})}
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Age</label>
                  <input
                    type="number"
                    value={regForm.age}
                    onChange={(e) => setRegForm({...regForm, age: e.target.value})}
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
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Gender</label>
                  <select
                    value={regForm.gender}
                    onChange={(e) => setRegForm({...regForm, gender: e.target.value})}
                    style={{ 
                      width: '100%', 
                      padding: '0.75rem', 
                      border: '2px solid #e0e0e0', 
                      borderRadius: '12px',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>Preferences</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const prefs = regForm.preferences.includes(cat)
                          ? regForm.preferences.filter(p => p !== cat)
                          : [...regForm.preferences, cat];
                        setRegForm({...regForm, preferences: prefs});
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        border: '2px solid',
                        borderColor: regForm.preferences.includes(cat) ? '#FF6B9D' : '#e0e0e0',
                        background: regForm.preferences.includes(cat) ? '#FF6B9D' : 'white',
                        color: regForm.preferences.includes(cat) ? 'white' : '#666',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        fontFamily: 'inherit'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
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
                  marginBottom: '0.5rem',
                  fontFamily: 'inherit'
                }}
              >
                Join The Table
              </button>

              <button
                type="button"
                onClick={() => setShowRegistration(false)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'white',
                  color: '#666',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Back to Login
              </button>
            </form>
          ) : (
            <div>
              <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
                Sign in to discover gaming sessions and connect with players
              </p>
              
              <button
                onClick={() => {
                  // Simulate social login - for demo, use existing users
                  if (users.length > 0) {
                    const demoUser = users[0];
                    DB.setCurrentUser(demoUser);
                    setCurrentUser(demoUser);
                  } else {
                    setShowRegistration(true);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: '#1877f2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'inherit'
                }}
              >
                <LogIn size={20} />
                Continue with Facebook
              </button>

              <button
                onClick={() => setShowRegistration(true)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'white',
                  color: '#FF6B9D',
                  border: '2px solid #FF6B9D',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontFamily: 'inherit'
                }}
              >
                <UserPlus size={20} />
                Create New Account
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFE5E5 0%, #FFF4E0 50%, #E5F9FF 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '2rem'
    }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        boxShadow: '0 4px 20px rgba(255, 107, 157, 0.3)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>🎲</div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>The Gaming Table</h1>
              <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Welcome, {currentUser.name}!</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setShowCreateTable(true)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'white',
                color: '#FF6B9D',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontFamily: 'inherit'
              }}
            >
              <Plus size={20} />
              Host a Game
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid white',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 2rem' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '800', 
          marginBottom: '1.5rem',
          color: '#333'
        }}>
          My Gaming Sessions
        </h2>

        {myTables.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>No gaming sessions yet!</h3>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Host your first game or join an upcoming session</p>
            <button
              onClick={() => setShowCreateTable(true)}
              style={{
                padding: '1rem 2rem',
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
              Create Your First Session
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {myTables.map(table => {
              const spotsLeft = table.numPlayers - table.participants.length;
              const isCreator = table.creatorId === currentUser.id;
              const firstGame = table.boardGames.length > 0 ? BOARD_GAMES.find(g => g.id === table.boardGames[0]) : null;
              const gameImage = firstGame?.imageUrl;
              
              return (
                <div
                  key={table.id}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                    transform: 'rotate(0deg)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) rotate(1deg)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(255, 107, 157, 0.3)';
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
                      background: 'linear-gradient(135deg, #FEC163 0%, #FFB88C 100%)',
                      padding: '1.5rem',
                      color: 'white'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                        {firstGame ? firstGame.image : '🎲'}
                      </div>
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
                        <span>{table.participants.length}/{table.numPlayers} players</span>
                      </div>
                    </div>

                    {table.boardGames.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem', fontWeight: '600' }}>
                          GAMES
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {table.boardGames.map(gameId => {
                            const game = BOARD_GAMES.find(g => g.id === gameId);
                            return game ? (
                              <div
                                key={gameId}
                                style={{
                                  padding: '0.4rem 0.8rem',
                                  background: '#f0f0f0',
                                  borderRadius: '12px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  color: '#555'
                                }}
                              >
                                {game.image} {game.name}
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

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

                    {spotsLeft > 0 && spotsLeft === 1 && (
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

                    {!isCreator && (
                      <button
                        onClick={() => handleLeaveTable(table.id)}
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
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '800', 
          marginBottom: '1.5rem',
          marginTop: '3rem',
          color: '#333'
        }}>
          Upcoming Sessions
        </h2>

        {upcomingTables.filter(t => !t.participants.includes(currentUser.id)).length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <p style={{ color: '#666', margin: 0 }}>No other upcoming sessions available</p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {upcomingTables
              .filter(table => !table.participants.includes(currentUser.id))
              .map(table => {
                const spotsLeft = table.numPlayers - table.participants.length;
                const creator = getUserById(table.creatorId);
                const firstGame = table.boardGames.length > 0 ? BOARD_GAMES.find(g => g.id === table.boardGames[0]) : null;
                const gameImage = firstGame?.imageUrl;
                
                return (
                  <div
                    key={table.id}
                    style={{
                      background: 'white',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px) rotate(-1deg)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(67, 233, 123, 0.3)';
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
                          <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>
                            Hosted by {creator?.name || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
                        padding: '1.5rem',
                        color: 'white'
                      }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                          {firstGame ? firstGame.image : '🎲'}
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>{table.title}</h3>
                        <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.9 }}>
                          Hosted by {creator?.name || 'Unknown'}
                        </div>
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
                          <span>{table.participants.length}/{table.numPlayers} players • {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</span>
                        </div>
                      </div>

                      {table.boardGames.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '0.5rem', fontWeight: '600' }}>
                            GAMES
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {table.boardGames.map(gameId => {
                              const game = BOARD_GAMES.find(g => g.id === gameId);
                              return game ? (
                                <div
                                  key={gameId}
                                  style={{
                                    padding: '0.4rem 0.8rem',
                                    background: '#f0f0f0',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#555'
                                  }}
                                >
                                  {game.image} {game.name}
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {spotsLeft > 0 ? (
                        <button
                          onClick={() => handleJoinTable(table.id)}
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
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Create Table Modal */}
      {showCreateTable && (
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
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '800' }}>Create Gaming Session</h2>
              <button
                onClick={() => setShowCreateTable(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  color: '#999'
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateTable}>
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
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
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
                  {BOARD_GAMES.map(game => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => {
                        const games = tableForm.boardGames.includes(game.id)
                          ? tableForm.boardGames.filter(g => g !== game.id)
                          : [...tableForm.boardGames, game.id];
                        setTableForm({...tableForm, boardGames: games});
                      }}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid',
                        borderColor: tableForm.boardGames.includes(game.id) ? '#4ECDC4' : '#e0e0e0',
                        background: tableForm.boardGames.includes(game.id) ? '#4ECDC4' : 'white',
                        color: tableForm.boardGames.includes(game.id) ? 'white' : '#666',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textAlign: 'left',
                        fontFamily: 'inherit'
                      }}
                    >
                      {game.image} {game.name}
                    </button>
                  ))}
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
      )}
    </div>
  );
};

export default App;
