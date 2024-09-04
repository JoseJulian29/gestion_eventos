// src/components/EventCard.js

import React from 'react';

const EventCard = ({ event, userRole }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <img src={event.banner} alt={event.title} className="w-full h-48 object-cover rounded-lg" />
      <h2 className="text-xl font-semibold mt-2">{event.title}</h2>
      <p className="text-gray-600">{event.description}</p>
      {userRole === 'Participante' || userRole === 'Taquilla' ? (
        <button className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">Ver Detalles</button>
      ) : null}
    </div>
  );
};

export default EventCard;
