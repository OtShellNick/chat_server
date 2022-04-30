const express = require("express");
const bodyParser = require("body-parser");

const {
    findUserByUsername,
    createUser,
    createSession,
    hash,
    auth,
    deleteSession,
    findUserBySessionId,
    updateUserById,
    getAllUsers,
    getUsersCount
} = require("../actions/userActions");
const {validateSignup, validateUpdate} = require('../vaidation');

const router = express.Router();

router.get('/me', auth(), (async (req, res) => {
    try {
        const chat_session_id = req.headers.authorization;

        const {username, email, gender, status, role, avatar} = await findUserBySessionId(chat_session_id);

        res.send({username, email, gender, status, role, avatar});
    } catch (err) {
        console.log('Error get users me', err);
        res.status(500).send({error: {message: 'Internal Server Error'}});
    }
}));

router.post('/signup', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {username, password, email, gender, avatar} = req.body;
    const valid = validateSignup({username, password, email, gender, avatar});

    if (Array.isArray(valid)) return res.send({status: 422, error: valid});

    try {
        const user = await findUserByUsername(username);

        if (user) return res.send({status: 409, error: 'Username is already exists'});

        const newUser = await createUser({username, password, email, gender, status: 'online', role: 'user', avatar});

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
        console.log('Error login', err);

        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.get('/logout', auth(), async (req, res) => {

    try {
        await deleteSession(req.chat_session_id);

        res.send({status: 200});
    } catch (err) {
        res.send({status: 401, error: 'Session expired'});
    }

});

router.post('/update/self', auth(), async (req, res) => {
    const {username, email, gender, avatar} = req.body;
    const valid = validateUpdate({username, email, gender});

    if (Array.isArray(valid)) return res.send({status: 422, error: valid});

    try {
        const {authorization} = req.headers;
        const user = await findUserBySessionId(authorization);

        const [newUser] = await updateUserById({id: user.id, username, email, gender, avatar});

        res.send({status: 200, newUser});
    } catch (e) {
        console.log('Error user update', e);

        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.post('/update', auth(), async (req, res) => {
    const {username, email, gender, avatar} = req.body;
    const valid = validateUpdate({username, email, gender});

    if (Array.isArray(valid)) return res.send({status: 422, error: valid});

    try {
        const {authorization} = req.headers;
        const user = await findUserBySessionId(authorization);

        if (!user) return res.send({status: 404, error: 'User not found'});
        if (user.role !== 'admin') return res.send({status: 403, error: 'You not allowed to do this'});

        const [newUser] = await updateUserById({id: user.id, username, email, gender, avatar});

        res.send({status: 200, newUser});
    } catch (e) {
        console.log('Error user update', e);

        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.get('/all', auth(), async (req, res) => {

    try {
        let users = await getAllUsers();
        users = users.map(user => {
            delete user.password;

            return user;
        });

        res.send({status: 200, users});
    } catch (e) {
        console.log('Error get all users', e);

        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
});

router.get('/all/crm', auth(), async (req, res) => {
    const {query} = req;

    try {
        let users = await getAllUsers(query);
        let [count] = await getUsersCount();
        users = users.map(user => {
            delete user.password;

            return user;
        });

        res.send({
            status: 200, users: {
                rows: users,
                count: Number(count.count)
            }
        });
    } catch (e) {
        console.log('Error get all users crm', e);

        res.status(500).send({error: {message: 'Internal Server Error'}})
    }
})

module.exports = router;