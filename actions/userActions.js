const {nanoid} = require("nanoid");
const moment = require("moment");
const crypto = require("crypto");
const knex = require('../DB');

const hash = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};

const auth = () => async (req, res, next) => {
    if (!req.cookies["chat_session_id"]) return res.send({status: 401});

    const chat_session_id = req.cookies["chat_session_id"];

    req.user = await findUserBySessionId(chat_session_id);
    req.chat_session_id = chat_session_id;
    next();
};

const findUserByUsername = async (username) => await knex("users")
    .select()
    .where({username})
    .limit(1)
    .then((resp) => resp[0]);

const createUser = async ({username, password, email, gender}) => {
    const newUser = {
        username,
        password: hash(password),
        email,
        gender
    };

    const [id] = await knex("users").insert(newUser).returning("id");

    return {...newUser, id};
};

const createSession = async ({id}) => {
    await deleteSessionByTime();
    await deleteSessionByUserId(id);

    const chat_session_id = nanoid();
    const expireAt = moment().add(3, 'days').utc(true);
    await knex("sessions").insert({chat_session_id, userId: id, expireAt});
    return chat_session_id;
};

const deleteSession = async (chat_session_id) => await knex("sessions").where({chat_session_id}).delete();

const deleteSessionByUserId = async id => {
    await knex('sessions').where('userId', '=', id).delete();
}

const deleteSessionByTime = async () => {
    const now = moment().utc(true);
    await knex('sessions').where('expireAt', '<', now).delete();
}

const findUserBySessionId = async (chat_session_id) => {
    const [session] = await knex("sessions").select().where({chat_session_id}).limit(1);

    if (!session) return;
    return await knex("users")
        .select()
        .where({id: session.userId})
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