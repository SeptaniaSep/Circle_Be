import joi from "joi";


export type FollowsDto = {
    followerId: string;
    followingId: string;
}

export const followsSchema = joi.object<FollowsDto>({
    followingId : joi.string().required(),
    followerId : joi.string().required(),
})