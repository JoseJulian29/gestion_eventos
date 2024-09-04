const mongoose = require('mongoose');
const Event = require('../models/Event'); // Asegúrate de que la ruta sea correcta
const Category = require('../models/Category');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const events = [
  {
    title: 'Tech Conference 2024',
    description: 'A conference about the latest in tech.',
    banner: 'http://example.com/banner1.jpg',
    logo: 'http://example.com/logo1.jpg',
    date: new Date('2024-11-10'),
    time: '09:00',
    location: 'Convention Center, City',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Art Workshop',
    description: 'A workshop on modern art techniques.',
    banner: 'http://example.com/banner2.jpg',
    logo: 'http://example.com/logo2.jpg',
    date: new Date('2024-12-05'),
    time: '14:00',
    location: 'Art Studio, Downtown',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Music Festival',
    description: 'A multi-day music festival featuring top bands and artists.',
    banner: 'http://example.com/banner3.jpg',
    logo: 'http://example.com/logo3.jpg',
    date: new Date('2024-11-20'),
    time: '12:00',
    location: 'City Park',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Coding Bootcamp',
    description: 'A week-long bootcamp to learn coding skills.',
    banner: 'http://example.com/banner4.jpg',
    logo: 'http://example.com/logo4.jpg',
    date: new Date('2024-11-15'),
    time: '10:00',
    location: 'Tech Hub, Downtown',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Food Truck Rally',
    description: 'A gathering of the best food trucks in the area.',
    banner: 'http://example.com/banner5.jpg',
    logo: 'http://example.com/logo5.jpg',
    date: new Date('2024-12-01'),
    time: '11:00',
    location: 'Main Street',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Health and Wellness Fair',
    description: 'An event focusing on health, wellness, and fitness.',
    banner: 'http://example.com/banner6.jpg',
    logo: 'http://example.com/logo6.jpg',
    date: new Date('2024-12-10'),
    time: '09:00',
    location: 'Community Center',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Startup Pitch Event',
    description: 'An opportunity for startups to pitch their ideas to investors.',
    banner: 'http://example.com/banner7.jpg',
    logo: 'http://example.com/logo7.jpg',
    date: new Date('2024-12-15'),
    time: '18:00',
    location: 'Business Incubator',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Photography Exhibition',
    description: 'An exhibition showcasing the work of local photographers.',
    banner: 'http://example.com/banner8.jpg',
    logo: 'http://example.com/logo8.jpg',
    date: new Date('2024-11-25'),
    time: '17:00',
    location: 'Gallery Space, Downtown',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Film Screening Night',
    description: 'An evening of screenings of indie and international films.',
    banner: 'http://example.com/banner9.jpg',
    logo: 'http://example.com/logo9.jpg',
    date: new Date('2024-12-20'),
    time: '19:00',
    location: 'Cultural Center',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Yoga Retreat',
    description: 'A weekend retreat focusing on yoga and mindfulness.',
    banner: 'http://example.com/banner10.jpg',
    logo: 'http://example.com/logo10.jpg',
    date: new Date('2024-11-30'),
    time: '08:00',
    location: 'Nature Resort',
    createdBy: '', 
    category: '' 
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Conectado a MongoDB');

    // Borra los eventos existentes
    await Event.deleteMany({});

    // Obtén las categorías y usuarios para los eventos
    const categories = await Category.find();
    const users = await User.find();

    // Mapea los nombres de categorías y usuarios a sus objetos
    const categoryMap = categories.reduce((map, category) => {
      map[category.name] = category.name;
      return map;
    }, {});

    const userMap = users.reduce((map, user) => {
      map[user.username] = user.username;
      return map;
    }, {});

    // Asigna una categoría y un usuario a cada evento
    for (const event of events) {
      event.category = Object.keys(categoryMap)[Math.floor(Math.random() * categories.length)];
      event.createdBy = Object.keys(userMap)[Math.floor(Math.random() * users.length)];
    }

    // Inserta los eventos en la base de datos
    await Event.insertMany(events);

    console.log('Eventos creados con éxito');

    // Cierra la conexión a la base de datos
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error al conectar a MongoDB:', err);
    mongoose.connection.close();
  });
