import { Response } from "express";

export default function sendJson(this: Response ,statusCode = 200, response: any) {
    let status = (statusCode >= 200 && statusCode < 300) ? true : false;
    
    if (!(typeof response == "object" && response.message && response.data))
        response = (typeof response == "string") ? { status, message : response } : { status , data : response };
    
    return this.status(statusCode).json(response); 
}   