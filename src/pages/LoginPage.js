import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { CATEGORIES, GENDER_OPTIONS } from '../constants';
import DB from '../services/database';

const LoginPage = ({
  showRegistration,
  setShowRegistration,
  regForm,
  setRegForm,
  handleRegister,
  users,
  onSelectUser
}) => {
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
                  {GENDER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
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
              onClick={async () => {
                if (users.length > 0) {
                  // Simulate social login - for demo, use existing users
                  const demoUser = users[0];
                  await DB.setCurrentUser(demoUser);
                  onSelectUser(demoUser);
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
};

export default LoginPage;
