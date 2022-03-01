require('dotenv').config();
let { ServiceBroker } = require("moleculer");
let ApiService = require("moleculer-web");
require('./DB').initDBConnection();

let broker = new ServiceBroker();

broker.createService(ApiService);

broker.start();

const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const Server = express();
const {PORT} = process.env;

Server.use(express.json());
Server.use(cookieParser());
Server.use(cors())

Server.use('/api/users', require('./requests/users'))

Server.listen(PORT, err => {
    console.log(`server listening on port ${PORT}`)
})