const mongoose = require('mongoose');
const Category = require('../models/Category');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const categories = [
  { name: 'Conferencias' },
  { name: 'Talleres' },
  { name: 'Social' }
];

mongoose.connect(`${process.env.MONGO_URI}`)
  .then(async () => {
    console.log('Conectado a MongoDB');

    await Category.deleteMany({});

    await Category.insertMany(categories);

    console.log('Categorías creadas con éxito');

    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    mongoose.connection.close();
  });
