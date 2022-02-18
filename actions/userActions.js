const { nanoid } = require("nanoid");
const crypto = require("crypto");
const {chat} = require('../DB');

const hash = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};

const auth = () => async (req, res, next) => {

    if (!req.cookies["sessionId"]) return res.status(401).redirect('/');

    const sessionId = req.cookies["sessionId"];

    req.user = await findUserBySessionId(sessionId);
    req.sessionId = sessionId;
    next();
};

const findUserByUsername = async (username) => await chat.collection("users").findOne({ username: username });

const createUser = async ({ username, password, email, gender }) => {
    const newUser = {
        username,
        password: hash(password),
        email,
        gender
    };

    const { insertedId } = await chat.collection("users").insertOne(newUser);

    return { ...newUser, id: insertedId };
};

const createSession = async (userId) => {
    const sessionId = nanoid();
    await chat.collection("sessions").insertOne({ sessionId, userId });
    return sessionId;
};

const deleteSession = async (sessionId) => await chat.collection("sessions").deleteOne({ sessionId });

const findUserBySessionId = async (sessionId) => {
    const session = await chat.collection("sessions").findOne({ sessionId });

    if (!session) return;
    return await chat.collection("users").findOne({ _id: session.userId });
};

module.exports = {
    hash,
    auth,
    findUserByUsername,
    createUser,
    createSession,
    deleteSession,
    findUserBySessionId
}