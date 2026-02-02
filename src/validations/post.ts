import { Joi } from 'express-validation';

export const createPost = {
    body : Joi.object({
        title : Joi.string().min(3).max(150).required(),
        content: Joi.string().min(3).max(3000).required(),
    })
}

export const getPostById = {
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}

export const updatePost = {
    params  : Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
    body : Joi.object({
        title : Joi.string().min(3).max(150),
        content: Joi.string().min(3).max(3000),
    }).required().not({})
}

export const deletePost = {
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    })
}