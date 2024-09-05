import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (user && (user.role === 'Taquilla' || user.role === 'Organizador')) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <button onClick={handleHomeClick} className="text-2xl font-bold">
        Gestevent
      </button>
      <div>
        {user ? (
          <>
            <span className="mr-4">Hola, {user.username}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Iniciar Sesión
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
