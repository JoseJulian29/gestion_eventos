// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { initSocket } = require('./socket');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();
const server = http.createServer(app);
const io = initSocket(server); // Inicializa Socket.IO

// Middlewares
app.use(express.json());
app.use(cors());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/register', registrationRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexión a la base de datos de MongoDB
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

connectDB();

const notifyClients = () => {
    io.emit('eventUpdate');
};

app.use((req, res, next) => {
    res.on('finish', () => {
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
            notifyClients();
        }
    });
    next();
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
