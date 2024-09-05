import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import { AuthContext } from '../context/AuthContext';
import EventModal from './EventFormModal';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const { user } = useContext(AuthContext);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/events');
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let results = events;

    if (searchQuery) {
      results = results.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      results = results.filter(event => event.category === selectedCategory);
    }

    setFilteredEvents(results);
  }, [searchQuery, selectedCategory, events]);

  const handleEventCreated = () => {
    fetchEvents();
  };

  const handleEdit = (event) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5001/api/events/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {user && user.role !== 'Participante' && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Crear Evento
          </button>
        </div>
      )}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventCreated={handleEventCreated}
        eventToEdit={eventToEdit}
        isEditMode={!!eventToEdit}
      />
      <SearchBar setSearchQuery={setSearchQuery} />
      <CategoryFilter setSelectedCategory={setSelectedCategory} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(event => (
          <EventCard
            key={event._id}
            event={event}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;
