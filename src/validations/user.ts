import { Joi } from 'express-validation';

export const createUser = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(15).required(),
        lastName: Joi.string().min(3).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(25).required()
    })
}

export const getUserById = {
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid Id").required()
    })
}

export const updateUser = {
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid Id").required()  
    }),
    body: Joi.object({
        firstName: Joi.string().min(3).max(15),
        lastName: Joi.string().min(3).max(15),
        email: Joi.string().email(),
    }).required().not({})
}

export const deleteuser = {
    params: Joi.object({
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid Id").required()        
    })
}
