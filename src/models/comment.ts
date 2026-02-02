import { Model, model, Schema, Document, HookNextFunction, PopulatedDoc } from 'mongoose';
import Post, { IPost } from './post';
import APIError from '../utils/APIError';
import { IUser } from './user';

export interface IComment extends Document {
    _id?        : string;
    user?       : PopulatedDoc<IUser>;
    post?       : PopulatedDoc<IPost>;
    comment     : string;
    isDeleted   : boolean;
    deletedAt   : Date;
    deletedBy   : string;
    createdAt?  : Date;
    updatedAt?  : Date;
}

const CommentScheam: Schema = new Schema({
    user        : { type: Schema.Types.ObjectId, ref: 'user', default: null},
    post        : { type: Schema.Types.ObjectId, ref: 'post', default: null },
    comment     : { type: String, required: true },
    isDeleted   : { type: Boolean, default: false },
    deletedAt   : { type: Date, default: null },
    deletedBy   : { type: Schema.Types.ObjectId, ref: 'user', default: null }
}, { versionKey : false, timestamps: true });


CommentScheam.pre('save', async function (this: IComment, next: HookNextFunction) {
    const post = await Post.findOne({ _id: this.post as string, isDeleted: false });
    if (post) 
        next();
    else 
        throw new APIError({ message: "Invalid Post id given.", status: 400 });
});

const Comment: Model<IComment> = model('comment', CommentScheam);

export default Comment;