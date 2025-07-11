import Joi from "joi";

export const likesSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  threadId: Joi.string().uuid().required(),
});

export interface LikesDto {
  userId: string;
  threadId: string;
}
