require('dotenv').config();
require('./DB').initDBConnection();

const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
const fs = require('fs');

const Server = express();
const {PORT} = process.env;

Server.use(express.json());
Server.use(cookieParser());
Server.use(cors());
Server.options('*', cors());

Server.use('/api/users', require('./requests/users'));

Server.get('/*', (req, res) => {
    console.log(req);
    const file = path.resolve(__dirname, `./dist${req.url}`);
    fs.readFile(file, (err, data) => {
        if (err) return res.send(path.resolve(__dirname, `./dist/index.html`));
        res.send(data.toString());
    });
})

Server.listen(PORT, err => {
    console.log(`server listening on port ${PORT}`)
})