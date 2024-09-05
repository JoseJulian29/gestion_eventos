const mongoose = require('mongoose');
const Event = require('../models/Event'); // Asegúrate de que la ruta sea correcta
const Category = require('../models/Category');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

const events = [
  {
    title: 'Conferencia de Tecnología 2024',
    description: 'Una conferencia sobre las últimas novedades en tecnología.',
    banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiXDcAKsRtvKa9Ue8GCn_teduMtK0ORP6a7Q&s',
    logo: 'http://example.com/logo1.jpghttps://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-11-10'),
    time: '09:00',
    location: 'Centro de Convenciones, Ciudad',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Taller de Arte',
    description: 'Un taller sobre técnicas de arte moderno.',
    banner: 'https://artesvisuales.uanl.mx/wp-content/uploads/2019/08/gera1_3-1024x683.jpg',
    logo: 'http://example.com/logo2.jpghttps://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-12-05'),
    time: '14:00',
    location: 'Estudio de Arte, Centro',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Festival de Música',
    description: 'Un festival de música de varios días con bandas y artistas destacados.',
    banner: 'https://comisariopantera.mx/wp-content/uploads/festival-de-musica-en-el-centro-de-mexico.jpg',
    logo: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-11-20'),
    time: '12:00',
    location: 'Parque de la Ciudad',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Bootcamp de Programación',
    description: 'Un bootcamp de una semana para aprender habilidades de programación.',
    banner: 'https://www.epitech-it.es/wp-content/uploads/2021/11/bootcamp-1.png',
    logo: 'http://example.com/logo4.jpghttps://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-11-15'),
    time: '10:00',
    location: 'Centro Tecnológico, Centro',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Rally de Food Trucks',
    description: 'Una reunión de los mejores food trucks de la zona.',
    banner: 'https://advancelocal-adapter-image-uploads.s3.amazonaws.com/expo.advance.net/img/52d56aa5e7/width2048/5a6_16.jpeg',
    logo: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-12-01'),
    time: '11:00',
    location: 'Calle Principal',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Feria de Salud y Bienestar',
    description: 'Un evento centrado en la salud, el bienestar y la condición física.',
    banner: 'https://pbs.twimg.com/media/E1WpxoNWQAMRI9j.jpg',
    logo: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-12-10'),
    time: '09:00',
    location: 'Centro Comunitario',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Evento de Pitch para Startups',
    description: 'Una oportunidad para que las startups presenten sus ideas a inversores.',
    banner: 'https://www.diariosustentable.com/wp-content/uploads/2023/11/Mas-Pitch-1.jpg',
    logo: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-12-15'),
    time: '18:00',
    location: 'Incubadora de Negocios',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Exposición de Fotografía',
    description: 'Una exposición que muestra el trabajo de fotógrafos locales.',
    banner: 'https://lh6.googleusercontent.com/proxy/gDLB408xHFIjcXv2UfT3AYrL4Bznaz8v3Yw3acrwOaadnkOpk98__6H1uuC17uIRGBsENJGmhUKIZ_g98oPAM-zyKMMgzuytUsbStxb7xzcdK1HsQ-Xy5Y0Uv5ezb6hBd9EAQg5Tk3qLdFpwswAn_Sx2YR3_-hfy7rEI9lrJGe4nkTiLu5RXm-0SQhE',
    logo: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybridhttp://example.com/logo8.jpg',
    date: new Date('2024-11-25'),
    time: '17:00',
    location: 'Espacio de Galería, Centro',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Noche de Proyección de Películas',
    description: 'Una noche de proyecciones de películas independientes e internacionales.',
    banner: 'https://www.globamaticmedia.com/wp-content/uploads/2024/04/133.jpg',
    logo: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-12-20'),
    time: '19:00',
    location: 'Centro Cultural',
    createdBy: '', 
    category: '' 
  },
  {
    title: 'Retiro de Yoga',
    description: 'Un retiro de fin de semana centrado en el yoga y la atención plena.',
    banner: 'https://zazilretreat.com/wp-content/uploads/2020/12/organiza-tu-propio-retiro-de-yoga.jpg',
    logo: 'https://img.freepik.com/vector-gratis/vector-degradado-logotipo-colorido-pajaro_343694-1365.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1725408000&semt=ais_hybrid',
    date: new Date('2024-11-30'),
    time: '08:00',
    location: 'Resort Natural',
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
