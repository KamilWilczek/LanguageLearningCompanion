import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import VocabularyList from './components/VocabularyList';
import ReviewDashboard from './components/ReviewDashboard';
import Register from './components/Register';
import Login from './components/Login';
import Logout from './components/Logout';
import AddVocabulary from './components/AddVocabulary';

const App: React.FC = () => {
  const token = localStorage.getItem('token');

  
  return (
    <Router>
      <div className='App'>
        <h1>Language Learning Companion</h1>
        {token && <Logout />}
        <Routes>
          <Route path="/" element={token ? <Navigate to="/review" /> : <Navigate to="/login" />} />
          <Route path="/review" element={<ReviewDashboard />} />
          <Route path="/vocabulary" element={<VocabularyList />} />
          <Route path="/add-vocabulary" element={<AddVocabulary />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;