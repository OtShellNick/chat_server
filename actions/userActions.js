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
    const {authorization} = req.headers;

    if (!authorization) return res.send({status: 401});

    const chat_session_id = authorization;

    await deleteSessionByTime();
    const user = await findUserBySessionId(chat_session_id);

    if (!user) return res.send({status: 401, error: 'Session expired'});

    req.user = user;
    req.chat_session_id = chat_session_id;
    next();
};

const findUserByUsername = async (username) => await knex("users")
    .select()
    .where({username})
    .limit(1)
    .then((resp) => resp[0]);

const createUser = async ({username, password, email, gender, status, role, avatar}) => {
    const newUser = {
        username,
        password: hash(password),
        email,
        gender,
        status,
        role,
        avatar
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
    await setUserOnline(id);
    return chat_session_id;
};

const deleteSession = async (chat_session_id) => {
    const user = await findUserBySessionId(chat_session_id);
    await knex("sessions").where({chat_session_id}).delete();
    await setUserOffline(user.id);
}

const deleteSessionByUserId = async id => {
    await knex('sessions').where('userId', '=', id).delete();
    await setUserOffline(id);
}

const deleteSessionByTime = async () => {
    const now = moment().utc(true);
    const usersIds = await knex('sessions').where('expireAt', '<', now).delete(['userId']);
    await Promise.all(usersIds.map(user => setUserOffline(user.userId)));
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

const setUserOffline = async (id) => {
    await knex('users').where('id', '=', id).update({status: 'offline'});
};

const setUserOnline = async (id) => {
    await knex('users').where('id', '=', id).update({status: 'online'});
};

const updateUserById = async user => {
    return await knex('users').where('id', '=', user.id).update(user, ['username', 'email', 'gender', 'status', 'role', 'avatar']);
}

const getAllUsers = async (query = {select: '*', limit: 20, offset: 0}) => {
    const {select, limit, offset} = query;
    return await knex.select(select).from('users').limit(Number(limit)).offset(Number(offset));
}

const getUsersCount = async () => {
    return await knex('users').where({}).count('id');
}

module.exports = {
    hash,
    auth,
    findUserByUsername,
    createUser,
    createSession,
    deleteSession,
    findUserBySessionId,
    updateUserById,
    getAllUsers,
    getUsersCount
}