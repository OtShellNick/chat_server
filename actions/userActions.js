const { nanoid } = require("nanoid");
const moment = require("moment");
const crypto = require("crypto");
const knex = require('../DB');

const hash = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};

const auth = () => async (req, res, next) => {

    if (!req.cookies["sessionId"]) return res.status(401).redirect('/login');

    const sessionId = req.cookies["sessionId"];

    req.user = await findUserBySessionId(sessionId);
    req.sessionId = sessionId;
    next();
};

const findUserByUsername = async (username) => await knex("users")
    .select()
    .where({ username })
    .limit(1)
    .then((resp) => resp[0]);

const createUser = async ({ username, password, email, gender }) => {
    const newUser = {
        username,
        password: hash(password),
        email,
        gender
    };

    const [id] = await knex("users").insert(newUser).returning("id");

    return { ...newUser, id };
};

const createSession = async ({id}) => {
    await deleteSessionByTime();
    const sessionId = nanoid();
    const expireAt = moment().add(3, 'days').utc(true);
    await knex("sessions").insert({ sessionId, userId: id, expireAt });
    return sessionId;
};

const deleteSession = async (sessionId) => await knex("sessions").where({ sessionId }).delete();

const deleteSessionByTime = async () => {
    const now = moment().utc(true);
    await knex('sessions').where('expireAt', '>', now).delete();
}

const findUserBySessionId = async (sessionId) => {
    const [session] = await knex("sessions").select().where({ sessionId }).limit(1);

    if (!session) return;
    return await knex("users")
        .select()
        .where({ id: session.userId })
        .limit(1)
        .then((resp) => resp[0]);
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