import React from 'react';
import GameSessionCard from './GameSessionCard';

const GameSessionGrid = ({ 
  tables, 
  currentUserId, 
  onJoinTable, 
  onLeaveTable, 
  getUserById,
  isMyTables 
}) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.5rem',
      marginBottom: '3rem'
    }}>
      {tables.map(table => (
        <GameSessionCard 
          key={table.id}
          table={table}
          currentUserId={currentUserId}
          onJoinTable={onJoinTable}
          onLeaveTable={onLeaveTable}
          getUserById={getUserById}
          isMyTables={isMyTables}
        />
      ))}
    </div>
  );
};

export default GameSessionGrid;
