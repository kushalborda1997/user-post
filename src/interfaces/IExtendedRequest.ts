import { Request } from 'express';
export default interface IRequest extends Request{
    user: {
        _id: string,
        role: string
    }
}