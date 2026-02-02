import jwt from 'jsonwebtoken';
import config from '../configuration';

export const deleteFields = (obj: any, keys: string[] | string, defaultFields: boolean = true) => {

    let basicFields = ['createdAt', 'deletedAt', 'updatedAt', 'isDeleted', 'deletedBy'];
    keys = (typeof keys == 'string') ? [keys] : keys || [];
   
    if (defaultFields) keys = keys.concat(basicFields);

    keys.forEach((key: string) => delete obj[key]);
    return obj;
}

export const signJwt = (payload: object) => jwt.sign(payload, config.tokenSecret);

/**
 * 
 * @param {object} payload 
 * @returns {object}
 */
export const toObject = (payload: object) => JSON.parse(JSON.stringify(payload));
