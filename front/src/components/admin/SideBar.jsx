import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUsers, FaTags, FaCalendarAlt } from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user || (user.role !== 'Taquilla' && user.role !== 'Organizador')) {
    return null;
  }

  return (
    <div className="w-64 h-full-screen bg-gray-800 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                }
              >
                <FaUsers className="mr-3" />
                <span>Usuarios</span>
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                }
              >
                <FaTags className="mr-3" />
                <span>Categorías</span>
              </NavLink>
            </li>
            <li className="mb-4">
              <NavLink
                to="/admin/events"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-gray-600' : ''}`
                }
              >
                <FaCalendarAlt className="mr-3" />
                <span>Eventos</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
