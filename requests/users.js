const express = require("express");
const bodyParser = require("body-parser");

const {findUserByUsername, createUser, createSession, hash, auth, deleteSession, findUserBySessionId} = require("../actions/userActions");
const {validateSignup} = require('../vaidation');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hello Chat')
});

router.get('/me', auth(), (async (req, res) => {
    try {
        const chat_session_id = req.cookies["chat_session_id"];

        const {username, email, gender} = await findUserBySessionId(chat_session_id);

        res.send({username, email, gender});
    } catch {
        res.status(500).send({error: {message: 'Internal Server Error'}});
    }
}))
//TODO обработка статуса
router.post('/signup', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {username, password, email, gender} = req.body;
    const valid = validateSignup({username, password, email, gender});

    if (Array.isArray(valid)) return res.send({status: 422, error: valid});

    try {
        const user = await findUserByUsername(username);

        if (user) return res.send({status: 409, error: 'Username is already exists'});

        const newUser = await createUser({username, password, email, gender, status: 'online', role: 'user'});

        const chat_session_id = await createSession(newUser.id);

        res.send({status: 200, chat_session_id});
    } catch (err) {
        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.post('/login', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await findUserByUsername(username);

        if (!user) return res.send({status: 404, error: 'User not found'});

        if (user.password !== hash(password)) return res.send({status: 403, error: 'Wrong username or password'});

        const chat_session_id = await createSession(user);

        res.send({status: 200, chat_session_id});
    } catch (err) {
        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.get('/logout', auth(), async (req, res) => {

    try {
        await deleteSession(req.chat_session_id);

        res.send({status: 200});
    } catch (err) {
        res.send({status: 404, error: 'Session not found'}).redirect("/login");
    }

})

module.exports = router;