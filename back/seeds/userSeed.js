const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

async function seedDatabase() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`)
    console.log('Conectado a MongoDB');

    await User.deleteMany({});

    const users = [
      {
        username: 'taquilla',
        email: 'taquilla@example.com',
        password: await bcrypt.hash(process.env.SYSTEM_PASSWORD, 10),
        role: 'Taquilla'
      },
      {
        username: 'organizador',
        email: 'organizador@example.com',
        password: await bcrypt.hash(process.env.SYSTEM_PASSWORD, 10),
        role: 'Organizador'
      },
      {
        username: 'participante',
        email: 'participante@example.com',
        password: await bcrypt.hash(process.env.SYSTEM_PASSWORD, 10),
        role: 'Participante'
      }
    ];

    await User.insertMany(users);

    console.log('Usuarios creados con éxito');

  } catch (err) {
    console.error('Error al conectar a MongoDB o insertar usuarios:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();