import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { IUser } from '../models/user';
import APIError from "../utils/APIError";

const handleJWT = (req: Request, _: Response , next: NextFunction, roles: string[] | string) => {

    return (err: Error, user: IUser & { role: string}, _: { message: string }) => {
        try {
            if (err || !user) 
                throw new APIError({ status: 401, message: 'Invalid token.'});

            if (roles !== undefined ) {
                roles = typeof roles === 'string' ? [roles] : roles;
                if (!roles.includes(user.role))
                    throw new APIError({ status: 403, message: "You don't have suffiecient accesss to this path!"});
            }
            req.user = user;
            return next();
        } catch (error) {
            return next(error);
        }
    }
}

const hasAuth = (roles: string[] | string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('jwt', { session: false }, handleJWT(req, res, next, roles))(req, res, next);
    }
}

export default hasAuth;