const knex = require('../DB');

const createRoom = async (room) => {
    const [id] = await knex("rooms").insert(room).returning("id");

    return id;
}

const getRoomById = async (id) => {
    const [room] = await knex("rooms").where({id});
    return room;
}

const deleteRoom = async (id) => {
    return await knex('rooms').where({id}).del();
}

const getRooms = async () => {
    return await knex("rooms").where({status: 'open'});
};

const getCountRooms = async () => {
    return await knex('rooms').where({status: 'open'}).count('id');
}

const updateRoomUsersIds = async (roomId, socketUser) => {
    const room = await getRoomById(roomId);
    const newRoom = {...room, usersIds: Array.from(new Set([...room.usersIds, socketUser.id]))};
    return await knex('rooms').where('id', '=', roomId).update(newRoom, ['id', 'name', 'description', 'tags', 'usersIds', 'status', 'owner'])
}

const deleteUserFromRoom = async (roomId, socketUser) => {
    const room = await getRoomById(roomId);
    const newRoom = {...room, usersIds: room.usersIds.filter(u => u !== socketUser.id)};
    return await knex('rooms').where('id', '=', roomId).update(newRoom, ['id', 'name', 'description', 'tags', 'usersIds', 'status', 'owner'])
}

module.exports = {
    createRoom,
    getRooms,
    getCountRooms,
    deleteRoom,
    getRoomById,
    updateRoomUsersIds,
    deleteUserFromRoom
}