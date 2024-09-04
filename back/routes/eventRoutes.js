const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Rutas para CRUD de eventos
router.get('/', getEvents); // Obtener todos los eventos
router.get('/:id', getEventById); // Obtener un evento por ID
router.post('/', createEvent); // Crear un nuevo evento
router.put('/:id', updateEvent); // Actualizar un evento por ID
router.delete('/:id', deleteEvent); // Eliminar un evento por ID

module.exports = router;
