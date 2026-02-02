import { Response } from "express";

export default interface IExtendedResponse extends Response {
    sendJson?: any
} 