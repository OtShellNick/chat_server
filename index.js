require('dotenv').config();
require('./DB').initDBConnection();

const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

const Server = express();
const {PORT} = process.env;

Server.use(express.json());
Server.use(cookieParser());
Server.use(cors());
Server.options('*', cors());

Server.get('/*', (req, res) => {
    console.log(req);
    res.sendFile(path.resolve(__dirname, '../chat-front/dist/index.html'));
})

Server.use('/api/users', require('./requests/users'))

Server.listen(PORT, err => {
    console.log(`server listening on port ${PORT}`)
})