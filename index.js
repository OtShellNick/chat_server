require('dotenv').config();
require('./DB').initDBConnection();

const express = require('express');
const cookieParser = require("cookie-parser");

const Server = express();
const {PORT} = process.env;

Server.use(express.json());
Server.use(cookieParser());

Server.use('/api/users', require('./requests/users'))

Server.listen(PORT, err => {
    console.log(`server listening on port ${PORT}`)
})