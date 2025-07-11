import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().allow(""),
  avatar: Joi.string().allow(""),
  banner: Joi.string().allow(""), 
  bio: Joi.string().allow(""),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});