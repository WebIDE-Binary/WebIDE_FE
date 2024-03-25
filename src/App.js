import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import IDEPage from './pages/IDE';

function App() {
  const isAuthenticated = () => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    return loggedIn === 'true';
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={isAuthenticated() ? <Navigate replace to="/" /> : <Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={isAuthenticated() ? <Main /> : <Navigate replace to="/login" />} />
          <Route path="/projects/:projectId" element={isAuthenticated() ? <IDEPage /> : <Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
