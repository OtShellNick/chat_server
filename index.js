const express = require('express');

const Server = express();

Server.use('/api/users', require('./requests/users'))

Server.listen(3000, err => {
    console.log('server listening on port 3000')
})