const express = require("express");
const {auth} = require("../actions/userActions");
const {createRoom, getRooms, getCountRooms} = require("../actions/roomsActions");

const router = express.Router();

router.post('/create', auth(), async (req, res) => {
    const {name, description, tags} = req.body;
    const {user} = req;
//TODO add validation
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
    const count = await getCountRooms();

    res.send({
        status: 200,
        rows: rooms,
        count: Number(count)
    })
} catch (err) {
    console.log('Error get all rooms', err);

    res.status(500).send({error: {message: 'Internal Server Error'}});
}
})

module.exports = router;