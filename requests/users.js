const express = require("express");
const bodyParser = require("body-parser");
const {chat, ObjectId} = require('../DB');

const {findUserByUsername, createUser, createSession, hash, auth, deleteSession} = require("../actions/userActions");
const {validateSignup} = require('../vaidation');

const router = express.Router();

router.get('/', async (req, res) => {
    console.log(await chat.collection("users").findOneAndDelete({_id: ObjectId('61fa6306ee74df4c81449a33')}))
    res.send('Hello Chat')
});

router.post('/signup', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {username, password, email, gender} = req.body;
    const valid = validateSignup({username, password, email, gender});

    if (Array.isArray(valid)) return res.status(422).send(valid);

    try {
        const user = await findUserByUsername(username);

        if (user) return res.status(409).send({error: {message: 'Username is already exists'}});

        const newUser = await createUser({username, password, email, gender});

        const sessionId = await createSession(newUser.id);

        res.cookie("sessionId", sessionId, {httpOnly: true}).redirect("/");
    } catch (err) {
        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.post('/login', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await findUserByUsername(username);

        if (!user) res.send({status: 404, error: 'User not found'});

        if (user.password !== hash(password)) res.send({status: 403, error: 'Wrong username or password'});

        const sessionId = await createSession(user._id);

        res.cookie("sessionId", sessionId, {httpOnly: true}).redirect("/");
    } catch (err) {
        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.get('/logout', auth(), async (req, res) => {

    try {
        await deleteSession(req.sessionId);

        res.clearCookie("sessionId").redirect("/login");
    } catch (err) {
        res.status(404).send({error: {message: 'Session not found'}}).redirect("/login");
    }

})

module.exports = router;