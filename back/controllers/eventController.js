// eventController.js
const Event = require('../models/Event');
const { getIo } = require('../socket');

// Obtener todos los eventos
const getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un evento por ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo evento
const createEvent = async (req, res) => {
  try {
    const { title, date, location, description, category, createdBy, banner, logo, time } = req.body;

    if (!title || !date || !location || !description || !category || !createdBy || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingEvent = await Event.findOne({ title, category });
    if (existingEvent) {
      return res.status(400).json({ message: 'Ya existe un evento con el mismo nombre en esta categoría.' });
    }

    const newEvent = new Event({
      title,
      date,
      location,
      description,
      category,
      createdBy,
      banner,
      logo,
      time
    });

    const savedEvent = await newEvent.save();
    
    const io = getIo();
    io.emit('eventUpdate');
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un evento por ID
const updateEvent = async (req, res) => {
  try {
    const { title, date, location, description, category, createdBy, banner, logo, time } = req.body;

    if (!title || !date || !location || !description || !category || !createdBy || !time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, date, location, description, category, createdBy, banner, logo, time },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    
    const io = getIo();
    io.emit('eventUpdate');
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un evento por ID
const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    
    const io = getIo();
    io.emit('eventUpdate');
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
