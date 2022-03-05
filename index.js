require('dotenv').config();

const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');
const fs = require('fs');
const {auth} = require("./actions/userActions");

const Server = express();
const {PORT} = process.env;

Server.use(express.json());
Server.use(cookieParser());
Server.use(cors());
Server.options('*', cors());

Server.use('/api/users', require('./requests/users'));

Server.get('/*', auth(), async (req, res) => {
    const files = (await fs.promises.readdir(`../chat-front/dist`)).map(f => `/${f}`);
    console.log(!files.includes(req.url))
    const file = !files.includes(req.url) ? '/index.html' : req.url;
    const fileStream = fs.createReadStream(path.join(__dirname, `../chat-front/dist${file}`))
    fileStream.pipe(res)
})

Server.listen(PORT, err => {
    console.log(`server listening on port ${PORT}`)
})