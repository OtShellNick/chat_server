const {findUserBySessionId} = require("../actions/userActions");
const {userHandler} = require("../actions/socketActions/userHandler");

const onConnection = async (io, socket) => {
    const {token} = socket.handshake.auth;
    const {roomId} = socket.handshake.query;

    const user = await findUserBySessionId(token);

    socket.roomId = roomId;
    socket.user = user;

    socket.join(roomId);

    userHandler(io, socket);
}

module.exports = {
    onConnection
}