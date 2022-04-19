const knex = require('../DB');

const createRoom = async (room) => {
    const [id] = await knex("rooms").insert(room).returning("id");

    return id;
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

module.exports = {
    createRoom,
    getRooms,
    getCountRooms,
    deleteRoom
}