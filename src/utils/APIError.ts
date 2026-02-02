import IError from "../interfaces/IError";

class ExtendableErrors extends Error {
   
    errors: any;
    status: number;
    isPublic: boolean;

    constructor({ message, errors, status, isPublic, stack } : IError) {
        super(message);
        this.name = this.constructor.name;
        this.message = message!;
        this.errors = errors;
        this.status = status!;
        this.isPublic = isPublic!;
        this.stack = stack;
    }
}

export default class APIError extends ExtendableErrors {
   
    constructor({ message, errors, stack, status = 500, isPublic = true}: IError) {
        super({ message, errors, status, isPublic, stack })
    }
}

