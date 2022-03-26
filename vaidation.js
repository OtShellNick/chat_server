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
        update: {
            username: { type: 'string', min: 3, max: 255, optional: true},
            password: { type: 'string', min: 3, max: 255, optional: true},
            email: { type: "email", optional: true },
            gender: { type: "enum", values: ["male", "female"], optional: true }
        }
    }
}

const validateSignup = data => {
    const check = validator.compile(schema.user.signup);

    return check(data);
}

const validateUpdate = data => {
    const check = validator.compile(schema.user.update);

    return check(data);
}

module.exports = {
    validateSignup,
    validateUpdate
}