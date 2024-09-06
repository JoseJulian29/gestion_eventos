import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EventModal from './EventModal';
import axios from 'axios';
import Swal from 'sweetalert2';

const EventCard = ({ event, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const isAdminOrOrganizer = user && (user.role === 'Taquilla' || user.role === 'Organizador');
  const isTaquilla = user && user.role === 'Taquilla';

  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/register/${user.username}/${event.title}`);
        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error('Error checking registration status:', error);
      }
    };

    if (user) {
      checkRegistrationStatus();
    }
  }, [user, event.title]);

  const handleViewDetails = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5001/api/register', { username: user.username, eventName: event.title });
      setIsRegistered(true);
      Swal.fire({
        icon: 'success',
        title: 'Registrado',
        text: 'Te has registrado exitosamente en el evento.',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error registering for the event:', error);
      const errorMessage = error.response && error.response.data ? error.response.data.error : 'Hubo un problema al registrarse para el evento.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col h-full relative">
      <img src={event.banner} alt={event.title} className="w-full h-48 object-cover rounded-lg" />
      <h2 className="text-xl font-semibold mt-2">{event.title}</h2>
      <p className="text-gray-600 mt-2 flex-grow">{event.description}</p>
      <div className="mt-4 flex justify-between items-center">
        {user && (
          <button
            onClick={handleViewDetails}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Ver Detalles
          </button>
        )}
        {user && user.role === 'Participante' && !isRegistered && (
          <button
            onClick={handleRegister}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Registrarse
          </button>
        )}
        {user && user.role === 'Participante' && isRegistered && (
          <button
            disabled
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Registrado
          </button>
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
      {isModalOpen && (
        <EventModal event={event} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default EventCard;
