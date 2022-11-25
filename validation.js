const Joi = require("joi");
const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });
  return schema.validate(data);
};

const partidoValidation = (data) => {
  const schema = Joi.object({
    nombre: Joi.string().max(255).required(),
    siglas: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  partidoValidation,
};
