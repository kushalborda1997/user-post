import {PopulatedDoc, model, Schema, Model, Document, HookNextFunction} from 'mongoose';
import bcrypt from 'bcrypt';
import { IRole } from './roles';
import { IPost } from './post';
import { IComment } from './comment';

export interface IUser extends Document {
    _id?            : string;
    firstName       : string;
    lastName        : string;
    email           : string;
    password        : string;
    isDeleted?      : boolean;
    deletedAt?      : Date;
    deletedBy?      : string;
    createdAt?      : Date;
    updatedAt?      : Date;
    posts?          : PopulatedDoc<IPost & Document>[];
    comments?       : PopulatedDoc<IComment & Document>[];
    role?           : PopulatedDoc<IRole & Document>;
}

const UserSchema: Schema = new Schema({
    firstName   : { type: String, required: true },
    lastName    : { type: String, required: true },
    email       : { type: String, required: true },
    password    : { type: String, required: true },
    role        : { type: Schema.Types.ObjectId, ref: 'role', default: null },
    posts       : [{type: Schema.Types.ObjectId, ref: 'post', default: []}],
    comments    : [{type: Schema.Types.ObjectId, ref: 'comment', default: []}],
    isDeleted   : { type: Boolean, default: false},
    deletedAt   : { type: Date, default: null },
    deletedBy   : { type: Schema.Types.ObjectId, default: null }
}, { timestamps: true, versionKey: false });


UserSchema.pre<IUser>('save', async function (next: HookNextFunction) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User: Model<IUser> = model('user', UserSchema);

export default User;