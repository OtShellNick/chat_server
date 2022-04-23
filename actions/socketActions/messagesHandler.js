const messages = {};

const messagesHandler = (io, socket) => {
    const {roomId} = socket;

    if(!messages[roomId]) messages[roomId] = [];

    const updateMessagesList = () => io.to(roomId).emit('message_list:update', messages[roomId]);

    socket.on('messages:get', async () => {
        //TODO add database for messages
    });

    socket.on('message:add', message => {
        message.createAt = Date.now();

        messages[roomId].push(message);

        updateMessagesList();

        //TODO add message to database
    })
}