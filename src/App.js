import React, { useState, useEffect } from 'react';
import { fetchBoardGames } from './services/gameService';
import { useUserManagement } from './hooks/useUserManagement';
import { useTableManagement } from './hooks/useTableManagement';
import { REGISTRATION_FORM_INITIAL_STATE, CREATE_TABLE_FORM_INITIAL_STATE } from './constants';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

const App = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [showCreateTable, setShowCreateTable] = useState(false);
  const [loading, setLoading] = useState(true);

  const { currentUser, users, loadUsers, register, logout, getUserById, setCurrentUser } = useUserManagement();
  const { createTable, joinTable, leaveTable, getMyTables, getUpcomingTables, loadTables } = useTableManagement(currentUser?.id);

  const [regForm, setRegForm] = useState(REGISTRATION_FORM_INITIAL_STATE);
  const [tableForm, setTableForm] = useState(CREATE_TABLE_FORM_INITIAL_STATE);

  useEffect(() => {
    const initializeApp = async () => {
      setLoading(true);
      await fetchBoardGames();
      await loadUsers();
      await loadTables();
      setLoading(false);
    };
    initializeApp();
  }, [loadUsers, loadTables]);

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(regForm);
    setShowRegistration(false);
    setRegForm(REGISTRATION_FORM_INITIAL_STATE);
  };

  const handleCreateTable = async (e) => {
    e.preventDefault();
    await createTable(tableForm);
    setShowCreateTable(false);
    setTableForm(CREATE_TABLE_FORM_INITIAL_STATE);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FF6B9D 0%, #FEC163 100%)' }}>
        <div style={{ fontSize: '2rem', color: 'white', fontWeight: '700' }}>Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginPage 
        showRegistration={showRegistration}
        setShowRegistration={setShowRegistration}
        regForm={regForm}
        setRegForm={setRegForm}
        handleRegister={handleRegister}
        users={users}
        onSelectUser={setCurrentUser}
      />
    );
  }

  return (
    <MainPage 
      currentUser={currentUser}
      showCreateTable={showCreateTable}
      setShowCreateTable={setShowCreateTable}
      tableForm={tableForm}
      setTableForm={setTableForm}
      handleCreateTable={handleCreateTable}
      handleLogout={handleLogout}
      myTables={getMyTables()}
      upcomingTables={getUpcomingTables()}
      joinTable={joinTable}
      leaveTable={leaveTable}
      getUserById={getUserById}
    />
  );
};

export default App;
