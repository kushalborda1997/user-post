import { model, Model, Schema, Document } from "mongoose";

export interface IRole extends Document {
    _id?         : string;
    name         : string;
    createdAt?   : Date;
    updatedAt?   : Date;    
}

const RoleSchema: Schema = new Schema({
    name        : { type: String, required: true }
}, { versionKey: false, timestamps: true });

const Role: Model<IRole> = model('role', RoleSchema); 

export default Role;