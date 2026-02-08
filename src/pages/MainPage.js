import React from 'react';
import GameSessionGrid from '../components/GameSessionGrid';
import CreateTableModal from '../components/CreateTableModal';
import Header from '../components/Header';

const MainPage = ({
  currentUser,
  showCreateTable,
  setShowCreateTable,
  tableForm,
  setTableForm,
  handleCreateTable,
  handleLogout,
  myTables,
  upcomingTables,
  joinTable,
  leaveTable,
  getUserById
}) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFE5E5 0%, #FFF4E0 50%, #E5F9FF 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: '2rem'
    }}>
      <Header 
        currentUser={currentUser}
        onHostGame={() => setShowCreateTable(true)}
        onLogout={handleLogout}
      />

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
          <GameSessionGrid 
            tables={myTables}
            currentUserId={currentUser.id}
            onLeaveTable={leaveTable}
            getUserById={getUserById}
            isMyTables={true}
          />
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
          <GameSessionGrid 
            tables={upcomingTables.filter(t => !t.participants.includes(currentUser.id))}
            currentUserId={currentUser.id}
            onJoinTable={joinTable}
            getUserById={getUserById}
            isMyTables={false}
          />
        )}
      </div>

      {showCreateTable && (
        <CreateTableModal 
          isOpen={showCreateTable}
          onClose={() => setShowCreateTable(false)}
          tableForm={tableForm}
          setTableForm={setTableForm}
          onSubmit={handleCreateTable}
        />
      )}
    </div>
  );
};

export default MainPage;
