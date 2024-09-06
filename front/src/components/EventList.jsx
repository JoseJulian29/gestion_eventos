import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import { AuthContext } from '../context/AuthContext';
import EventFormModal from './EventFormModal';
import Swal from 'sweetalert2';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/events');
      const eventsData = response.data;
      setEvents(eventsData);
      setFilteredEvents(eventsData);

      const counts = eventsData.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {});
      setCategoryCounts(counts);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/categories');
      const categoriesData = response.data;
      const categoriesMap = categoriesData.reduce((acc, category) => {
        acc[category.name] = category.image;
        return acc;
      }, {});
      setCategories(categoriesMap);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Filter events based on search query and selected category
  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedCategory, events]);

  const filterEvents = () => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    setFilteredEvents(filtered);
  };

  const handleDeleteEvent = (eventId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás recuperar este evento después de eliminarlo!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/api/events/${eventId}`);
          Swal.fire('Eliminado!', 'El evento ha sido eliminado.', 'success');
          fetchEvents();
        } catch (error) {
          Swal.fire('Error!', 'Hubo un problema al eliminar el evento. Inténtalo de nuevo.', 'error');
        }
      }
    });
  };

  const handleOpenModal = (event) => {
    setEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEventToEdit(null);
    setIsModalOpen(false);
  };

  const handleEventCreated = () => {
    fetchEvents();
  };

  const groupedEvents = filteredEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = {
        events: [],
        image: categories[event.category],
      };
    }
    acc[event.category].events.push(event);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      {user && user.role !== 'Participante' && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => handleOpenModal(null)}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            Crear Evento
          </button>
        </div>
      )}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEventCreated={handleEventCreated}
        eventToEdit={eventToEdit}
        isEditMode={!!eventToEdit}
      />
      <SearchBar setSearchQuery={setSearchQuery} />
      <CategoryFilter
        categories={Object.keys(categoryCounts)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div>
        {Object.keys(groupedEvents).map((category) => (
          <div key={category} className="mb-6">
            <div className="flex items-center mb-2">
              {groupedEvents[category].image && (
                <img
                  src={`http://localhost:5001/uploads/${groupedEvents[category].image}`}
                  alt={category}
                  className="w-16 h-16 object-cover mr-4 rounded-full"
                />
              )}
              <h2 className="text-xl font-bold">
                {category} ({categoryCounts[category]})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {groupedEvents[category].events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onEdit={() => handleOpenModal(event)}
                  onDelete={() => handleDeleteEvent(event._id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
