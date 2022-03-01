require('dotenv').config();
let {ServiceBroker} = require("moleculer");
let ApiService = require("moleculer-web");
require('./DB').initDBConnection();

let broker = new ServiceBroker();

broker.createService({
    name: 'io',
    mixins: [ApiService],
    settings:{
        cors: {
            origin: '*',
            methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: [],
            exposedHeaders: [],
            credentials: false,
            maxAge: 3600
        },
        routes: [
            {
                path: '/api',

                aliases: {
                    'POST /users/login': 'user.login'
                },

                cors: {
                    origin: ['http://localhost:3000'],
                    methods: ['GET', 'OPTIONS', 'POST'],
                    credentials: true
                },

                mappingPolicy: 'restrict',

                authorization: true
            }
        ]
    }
});

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