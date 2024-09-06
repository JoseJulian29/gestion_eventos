const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// Ruta para registrar un usuario en un evento
router.post('/', async (req, res) => {
  const { username, eventName } = req.body;

  if (!username || !eventName) {
    return res.status(400).json({ error: 'Username and event name are required.' });
  }

  try {
    const existingRegistration = await Registration.findOne({ username, eventName });
    
    if (existingRegistration) {
      return res.status(400).json({ error: 'User is already registered for this event.' });
    }

    const registration = new Registration({
      username,
      eventName
    });

    await registration.save();
    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:username/:eventName', async (req, res) => {
  const { username, eventName } = req.params;

  if (!username || !eventName) {
    return res.status(400).json({ error: 'Username and event name are required.' });
  }

  try {
    const existingRegistration = await Registration.findOne({ username, eventName });
    if (existingRegistration) {
      return res.status(200).json({ isRegistered: true });
    } else {
      return res.status(200).json({ isRegistered: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
