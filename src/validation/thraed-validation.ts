import Joi from "joi";

export const ThreedSchema = Joi.object({
    description: Joi.string().min(1).required(),
    image: Joi.string().allow(null).optional()
})