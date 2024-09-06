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

/**
 * @openapi
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - location
 *         - description
 *         - category
 *         - createdBy
 *         - time
 *       properties:
 *         id:
 *           type: string
 *           description: Event ID
 *         title:
 *           type: string
 *           description: Event title
 *         date:
 *           type: string
 *           format: date
 *           description: Event date
 *         location:
 *           type: string
 *           description: Event location
 *         description:
 *           type: string
 *           description: Event description
 *         category:
 *           type: string
 *           description: Event category
 *         createdBy:
 *           type: string
 *           description: ID of the event creator
 *         banner:
 *           type: string
 *           description: Name of the event banner file
 *         logo:
 *           type: string
 *           description: Name of the event logo file
 *         time:
 *           type: string
 *           description: Event time
 *       example:
 *         id: 60d0fe4f5311236168a109ca
 *         title: "Rock Concert"
 *         date: "2024-10-01"
 *         location: "Central Stadium"
 *         description: "A great rock concert with local bands."
 *         category: "Music"
 *         createdBy: "60d0fe4f5311236168a109cb"
 *         banner: "rock_concert.jpg"
 *         logo: "rock_logo.jpg"
 *         time: "19:00"
 */

/**
 * @openapi
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/events/{id}:
 *   put:
 *     summary: Update an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Event ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */