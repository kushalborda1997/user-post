import { Joi } from 'express-validation';

export const createComment = {
    body : Joi.object({
        comment: Joi.string().min(3).max(50).required(),
        post : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}

export const getCommentById = {
    params : Joi.object({
        id : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}

export const upadateComment = {
    params : Joi.object({
        id : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body : Joi.object({
        comment : Joi.string().min(3).max(50)
    }).required().not({})
}

export const deleteComment = {
    params : Joi.object({
        id : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}