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

Server.get('/*',async (req, res) => {
    console.log(req.url)
    const files = (await fs.promises.readdir(`./web/build`)).map(f => `/${f}`)
    const file = !files.includes(req.url) ? '/index.html' : req.url
    console.log(file)
    const fileStream = fs.createReadStream(path.join(__dirname, `web/build${file}`))
    fileStream.pipe(res)
})

Server.listen(PORT, err => {
    console.log(`server listening on port ${PORT}`)
})