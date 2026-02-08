import { useState, useCallback } from 'react';
import DB from '../services/database';

export const useUserManagement = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    const [loadedUser, loadedUsers] = await Promise.all([
      DB.getCurrentUser(),
      DB.getUsers()
    ]);
    setCurrentUser(loadedUser);
    setUsers(loadedUsers);
    return { loadedUser, loadedUsers };
  }, []);

  const register = useCallback(async (formData) => {
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    await DB.saveUsers(updatedUsers);
    await DB.setCurrentUser(newUser);
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    return newUser;
  }, [users]);

  const logout = useCallback(async () => {
    await DB.setCurrentUser(null);
    setCurrentUser(null);
  }, []);

  const getUserById = useCallback((userId) => {
    return users.find(u => u.id === userId);
  }, [users]);

  return {
    currentUser,
    users,
    setCurrentUser,
    loadUsers,
    register,
    logout,
    getUserById
  };
};
