import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  const userRole = 'Participante'; // Este código no es necesario si no lo usas
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<EventList />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
