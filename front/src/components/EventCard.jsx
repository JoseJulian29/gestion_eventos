import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EventCard = ({ event, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);

  const isAdminOrOrganizer = user && (user.role === 'Taquilla' || user.role === 'Organizador');
  const isTaquilla = user && user.role === 'Taquilla';

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col h-full">
      <img src={event.banner} alt={event.title} className="w-full h-48 object-cover rounded-lg" />
      <h2 className="text-xl font-semibold mt-2">{event.title}</h2>
      <p className="text-gray-600 mt-2 flex-grow">{event.description}</p>
      <div className="mt-4 flex justify-between items-center">
        {user && (
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Ver Detalles</button>
        )}
        {isAdminOrOrganizer && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(event)}
              className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
              aria-label="Editar"
            >
              <FaEdit />
            </button>
            {isTaquilla && (
              <button
                onClick={() => onDelete(event._id)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                aria-label="Eliminar"
              >
                <FaTrash />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
