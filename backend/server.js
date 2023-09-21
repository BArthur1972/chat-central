const express = require('express');
const cors = require('cors');
require('./connection.js');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Add middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);

const server = require('http').createServer(app);
const PORT = 5001;

// Create socket connection and pass in server instance and cors options to allow for cross-origin requests from client side
const socket = require('socket.io')(server, {
    cors: {
        origin: 'https://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Listen for connection event and log to console
server.listen(PORT, ()  => {
    console.log('Listening to port: ', PORT);
});