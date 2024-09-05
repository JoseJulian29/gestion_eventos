import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

const EventModal = ({ event, onClose }) => {
  const modalRef = useRef(null);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
          aria-label="Cerrar"
        >
          <FaTimes size={20} />
        </button>
        <img src={event.banner} alt={event.title} className="w-full h-48 object-cover rounded-lg mb-4" />
        <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
        <p className="text-gray-800 mb-2">{event.description}</p>
        <p className="text-gray-600"><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p className="text-gray-600"><strong>Hora:</strong> {event.time}</p>
        <p className="text-gray-600"><strong>Ubicación:</strong> {event.location}</p>
        <p className="text-gray-600"><strong>Categoría:</strong> {event.category}</p>
        <p className="text-gray-600"><strong>Creado por:</strong> {event.createdBy}</p>
      </div>
    </div>
  );
};

export default EventModal;
