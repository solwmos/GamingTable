import { useState, useCallback } from 'react';
import DB from '../services/database';

export const useTableManagement = (currentUserId) => {
  const [gamingTables, setGamingTables] = useState([]);

  const loadTables = useCallback(async () => {
    const loadedTables = await DB.getTables();
    setGamingTables(loadedTables);
    return loadedTables;
  }, []);

  const createTable = useCallback(async (formData) => {
    const newTable = {
      id: Date.now().toString(),
      ...formData,
      creatorId: currentUserId,
      participants: [currentUserId],
      createdAt: new Date().toISOString()
    };
    const updatedTables = [...gamingTables, newTable];
    await DB.saveTables(updatedTables);
    setGamingTables(updatedTables);
    return newTable;
  }, [gamingTables, currentUserId]);

  const joinTable = useCallback(async (tableId) => {
    const updatedTables = gamingTables.map(table => {
      if (table.id === tableId && !table.participants.includes(currentUserId)) {
        return { ...table, participants: [...table.participants, currentUserId] };
      }
      return table;
    });
    await DB.saveTables(updatedTables);
    setGamingTables(updatedTables);
  }, [gamingTables, currentUserId]);

  const leaveTable = useCallback(async (tableId) => {
    const updatedTables = gamingTables.map(table => {
      if (table.id === tableId) {
        return { ...table, participants: table.participants.filter(id => id !== currentUserId) };
      }
      return table;
    });
    await DB.saveTables(updatedTables);
    setGamingTables(updatedTables);
  }, [gamingTables, currentUserId]);

  const getMyTables = useCallback(() => {
    return gamingTables.filter(table => 
      table.participants.includes(currentUserId) || table.creatorId === currentUserId
    );
  }, [gamingTables, currentUserId]);

  const getUpcomingTables = useCallback(() => {
    return gamingTables
      .filter(table => new Date(table.dateTime) > new Date())
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }, [gamingTables]);

  return {
    gamingTables,
    loadTables,
    createTable,
    joinTable,
    leaveTable,
    getMyTables,
    getUpcomingTables
  };
};
