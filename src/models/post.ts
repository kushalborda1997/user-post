import {Model, model, Schema, Document, PopulatedDoc} from 'mongoose';
import { IComment } from './comment';
import { IUser } from './user';

export interface IPost extends Document {
    _id?        : string;
    title       : string;
    content     : string;
    user?       : PopulatedDoc<IUser>;
    comments?   : PopulatedDoc<IComment>[];
    isDeleted?  : boolean;
    deletedAt?  : Date;
    deletedBy?  : string;
    createdAt?  : Date;
    updatedAt?  : Date;
}

const PostSchema: Schema = new Schema({
    title       : { type: String, required: true },
    content     : { type: String, required: true },
    user        : { type: Schema.Types.ObjectId, ref: "user", default: null },
    comments    : [{ type: Schema.Types.ObjectId, ref: "comment", default: null }],
    isDeleted   : { type: Boolean, default: false },
    deletedAt   : { type: Date, default: null },
    deletedBy   : { type: Schema.Types.ObjectId, default: null }
}, { versionKey: false, timestamps: true });

const Post: Model<IPost> = model('post', PostSchema);

export default Post;
