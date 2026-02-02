import { RequestHandler } from 'express';
import passport from 'passport';

import ExtendedResponse from '../interfaces/IExtendedResponse';
import APIError from '../utils/APIError';
import { signJwt } from '../utils/helper';

export const loginHandler: RequestHandler = (req, res: ExtendedResponse, next) => {
    try {
        passport.authenticate('login', async(err, user, info) => {
            if (err || !user || info) {
                    let error = new APIError({ status : 401, message : info.message });
                return next(error)
            }
            req.login(user, { session : false }, async (err) => {
                if (err) return next(err.message);
                const body = { _id : user._id, email : user.email, role : user.role };
                const token = signJwt({user : body});
                return res.sendJson(200, token);    
            })
        })(req, res, next);
    } catch(err) {
        next(err)
    }
}
