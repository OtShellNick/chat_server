const express = require("express");
const {auth} = require("../actions/userActions");
const {createRoom, getRooms, getCountRooms, deleteRoom} = require("../actions/roomsActions");
const {validateRooms} = require("../vaidation");

const router = express.Router();

router.post('/create', auth(), async (req, res) => {
    const {name, description, tags} = req.body;
    const {user} = req;

    const valid = validateRooms({name, description, tags});
    if (Array.isArray(valid)) return res.send({status: 422, error: valid});

    try {
        const {id} = await createRoom({name, description, usersIds: [user.id], tags, status: 'open'});

        res.send({status: 200, roomId: id});
    } catch (err) {
        console.log(err);
        res.status(500).send({error: {message: 'Internal Server Error'}});
    }
});

router.get('/all', auth(), async (req, res) => {
    try {
        const rooms = await getRooms();
        const [count] = await getCountRooms();

        res.send({
            status: 200,
            rows: rooms,
            count: Number(count.count)
        })
    } catch (err) {
        console.log('Error get all rooms', err);

        res.status(500).send({error: {message: 'Internal Server Error'}});
    }
});

router.delete('/:id', auth(), async (req, res) => {
   const {id} = req.params;
   const {user} = req;

   if(user.role !== 'admin') return res.send({status: 403, error: 'You not allowed to do this'});
//TODO продумать логику удаления комнаты
   try {
       await deleteRoom(id);

       res.send({status: 200})
   } catch (err) {
       console.log('Error delete rooms', err);

       res.status(500).send({error: {message: 'Internal Server Error'}});
   }
});

module.exports = router;