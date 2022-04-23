const users = {};

const userHandler = (io, socket) => {
    const {roomId, user} = socket;

    if(!users[roomId]) users[roomId] = [];

    //TODO newMap
    const updateUsersList = () => io.to(roomId).emit('users_list:update', users[roomId]);

    socket.on('user:add', (socketUser) => {
        console.log(socketUser)
        io.to(roomId).emit('log', `${socketUser.username} connected`);

        socketUser.socketId = socket.id;

        users[roomId].push(socketUser);
        //TODO update users in database room
        updateUsersList();
    });

    socket.on('users_list:get', () => {
        updateUsersList();
    })

    socket.on('disconnect', () => {

        if(!users[roomId]) return;

        socket.to(roomId).emit('log', `${user.username} disconnected`);

        users[roomId] = users[roomId].filter(u => u.socketId !== socket.id);
        //TODO add delete user from database room
        updateUsersList();
    });

    setTimeout(() => {
        updateUsersList()
    }, 5000)
}

module.exports = {
    userHandler
}