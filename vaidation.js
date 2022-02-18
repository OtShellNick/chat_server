const Validator = require("fastest-validator");
const validator = new Validator();

const schema = {
    user: {
        signup: {
            username: { type: 'string', min: 3, max: 255},
            password: { type: 'string', min: 3, max: 255},
            email: { type: "email" },
            gender: { type: "enum", values: ["male", "female"], optional: true }
        },
        login: {
            username: { type: 'string', min: 3, max: 255},
            password: { type: 'string', min: 3, max: 255}
        }
    }
}

const validateSignup = data => {
    const check = validator.compile(schema.user.signup);

    return check(data);
}

const validateLogin = data => {
    const check = validator.compile(schema.user.login);

    return check(data);
}

module.exports = {
    validateSignup,
    validateLogin
}