import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Gestevent
      </Link>
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
