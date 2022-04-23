require('dotenv').config();

const express = require('express');
const {Server} = require('socket.io');
const {createServer } = require('http');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {onConnection} = require("./socket/onConnection");

const App = express();
const {PORT} = process.env;

App.use(express.json());
App.use(cookieParser());
App.use(cors());
App.options('*', cors());

App.use('/api/users', require('./requests/users'));
App.use('/api/rooms', require('./requests/rooms'));

const server = createServer(App);
const SocketServer = new Server(server, {
    cors: {
        origin: '*'
    }
});
SocketServer.on('connection', socket => {
    onConnection(SocketServer, socket);
})

SocketServer.on('disconnect', socket => {
    console.log('disconnect', socket)
})

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})