const express = require("express");
const {auth} = require("../actions/userActions");
const {createRoom, getRooms} = require("../actions/roomsActions");

const router = express.Router();

router.post('/create', auth(), async (req, res) => {
    const {name, description, tags} = req.body;
    const {user} = req;

    try {
        const {id} = await createRoom({name, description, userId: user.id, tags});

        res.send({roomId: id});
    } catch (err) {
        res.status(500).send({error: {message: 'Internal Server Error'}});
    }
});

router.get('/all', auth(), async (req, res) => {
try {
    const rooms = await getRooms();

    res.send({
        rows: rooms,
        count: rooms.length
    })
} catch (err) {
    res.status(500).send({error: {message: 'Internal Server Error'}});
}
})

module.exports = router;