import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Create from './views/Create';
import Edit from './views/Edit';
import Show from './views/Show';
import Login from './views/Login';
import Register from './views/Register';
import Logout from './components/Logout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/activity/new" element={<Create />} />
          <Route path="/activity/:id" element={<Show />} />
          <Route path="/activity/edit/:id" element={<Edit />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; 
