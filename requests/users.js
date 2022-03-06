const express = require("express");
const bodyParser = require("body-parser");

const {findUserByUsername, createUser, createSession, hash, auth, deleteSession} = require("../actions/userActions");
const {validateSignup} = require('../vaidation');

const router = express.Router();

router.get('/', async (req, res) => {
    res.send('Hello Chat')
});

router.post('/signup', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {username, password, email, gender} = req.body;
    const valid = validateSignup({username, password, email, gender});

    if (Array.isArray(valid)) return res.send({status: 422, error: valid});

    try {
        const user = await findUserByUsername(username);

        if (user) return res.send({status: 409, error: 'Username is already exists'});

        const newUser = await createUser({username, password, email, gender});

        const sessionId = await createSession(newUser.id);

        res.send({status: 200, sessionId});
    } catch (err) {
        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.post('/login', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {username, password} = req.body;
console.log(req.body)
    try {
        const user = await findUserByUsername(username);

        if (!user) return res.send({status: 404, error: 'User not found'});

        if (user.password !== hash(password)) return res.send({status: 403, error: 'Wrong username or password'});

        const sessionId = await createSession(user);

        res.send({status: 200, sessionId});
    } catch (err) {
        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.get('/logout', auth(), async (req, res) => {

    try {
        await deleteSession(req.sessionId);

        res.send({status: 200});
    } catch (err) {
        res.send({status: 404, error: 'Session not found'}).redirect("/login");
    }

})

module.exports = router;