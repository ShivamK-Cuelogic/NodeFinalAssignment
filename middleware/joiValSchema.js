var Joi = require("joi");

module.exports = Joi.object().keys({
    username : Joi.string().required(),
    firstName : Joi.string().required(),
    lastName : Joi.string().required(),
    password : Joi.string().min(3).max(10).required()
});