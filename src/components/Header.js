import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({ currentUser, onHostGame, onLogout }) => {
  return (
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
            onClick={onHostGame}
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
            onClick={onLogout}
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
  );
};

export default Header;
