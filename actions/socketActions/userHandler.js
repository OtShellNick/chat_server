const {updateRoomUsersIds, deleteUserFromRoom} = require("../roomsActions");
const users = {};

const userHandler = (io, socket) => {
    const {roomId, user} = socket;

    if (!users[roomId]) users[roomId] = [];

    //TODO newMap
    const updateUsersList = () => io.to(roomId).emit('users_list:update', users[roomId]);

    socket.on('user:add', async (socketUser) => {
        io.to(roomId).emit('log', `${socketUser.username} connected`);

        socketUser.socketId = socket.id;

        users[roomId].push(socketUser);

        updateUsersList();
        await updateRoomUsersIds(roomId, user);
    });

    socket.on('users_list:get', () => {
        updateUsersList();
    })

    socket.on('disconnect', async () => {

        if (!users[roomId]) return;

        socket.to(roomId).emit('log', `${user.username} disconnected`);

        users[roomId] = users[roomId].filter(u => u.socketId !== socket.id);

        updateUsersList();
        await deleteUserFromRoom(roomId, user);
        //TODO add check empty room
    });

    setTimeout(() => {
        updateUsersList()
    }, 5000)
}

module.exports = {
    userHandler
}