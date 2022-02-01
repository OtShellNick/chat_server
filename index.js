const express = require('express');

const Server = express();

Server.get('/', (req, res) => {
    res.send('Hello Chat')
});

Server.listen(3000, err => {
    console.log('server listening on port 3000')
})