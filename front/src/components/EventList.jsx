// src/components/EventList.js

import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

const EventList = ({ userRole }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/events');
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search query and selected category
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

  return (
    <div className="container mx-auto p-4">
      <SearchBar setSearchQuery={setSearchQuery} />
      <CategoryFilter setSelectedCategory={setSelectedCategory} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(event => (
          <EventCard key={event._id} event={event} userRole={userRole} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
