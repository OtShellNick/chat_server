require('dotenv').config();

const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Server = express();
const {PORT} = process.env;

Server.use(express.json());
Server.use(cookieParser());
Server.use(cors());
Server.options('*', cors());

Server.use('/api/users', require('./requests/users'));
Server.use('/api/rooms', require('./requests/rooms'));

Server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})