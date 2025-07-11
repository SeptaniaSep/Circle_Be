import Joi from "joi";

export const ReplaySchema = Joi.object({
    description: Joi.string().min(1).required(),
    image: Joi.string().allow(null).optional()
})