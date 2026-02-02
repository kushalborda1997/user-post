import { Request, NextFunction } from 'express';
import { ValidationError } from 'express-validation';
import APIError from '../utils/APIError'
import ExtendedResponse from '../interfaces/IExtendedResponse';

export default class ErrorHandler {
    
    getErrorMessage (error: any) {
        error = error.details;
        if (error.params)   return error.params[0].message;
        if (error.body)     return error.body[0].message;
        if (error.query)    return error.query[0].message;
    }

    handler (err: any, _: Request, res: ExtendedResponse, _2: NextFunction) {

        let message = err.message || "Something went wrong. Please try again later.";
        if (!err.isPublic) {
            err.status = 500;
            message = "Something went wrong. Please try again later.";
        }
        if (process.env.NODE_ENV === 'development') {
            if (err.stack)  console.log(err.stack);
            if (err.errors) console.log(err.errors);
        }
        return res.sendJson(err.status, message);
    }

    converter (err: any, req: Request, res: ExtendedResponse, next: NextFunction) {
        let convertedErr = err;

        const errorHandler = new ErrorHandler();
    
        if (err instanceof ValidationError)
            convertedErr = new APIError({ status : 422, message : errorHandler.getErrorMessage(err)});
        else if (!(err instanceof APIError))
            convertedErr = new APIError({ status : err.status, message : err.message, stack : err.stack });

        return errorHandler.handler(convertedErr, req, res, next);
    }

    notFound (req: Request, res: ExtendedResponse, next: NextFunction) {
        const err = new APIError({ message: 'Page not found', status: 404});
        return new ErrorHandler().handler(err, req, res, next);
    } 
}

