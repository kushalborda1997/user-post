import { RequestHandler } from 'express';
import Comment, { IComment } from '../models/comment';
import Post, { IPost } from '../models/post';
import User from '../models/user';
import APIError from '../utils/APIError';
import { deleteFields, toObject } from '../utils/helper';
import * as Types from '../types';
import ExtendedResponse from '../interfaces/IExtendedResponse';
import { LeanDocument } from 'mongoose';

export const createComment: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const payload: IComment = req.body;
        const requestedUser: Types.RequestedUser = req.user!;
        const comment: IComment = await Comment.create({...payload, user: requestedUser._id});
        await Post.findOneAndUpdate({ _id: comment.post as string }, { $addToSet: { comments: comment._id }});
        await User.findOneAndUpdate({ _id: comment.user as string }, { $addToSet : { comments: comment._id }});
        return res.sendJson(200, deleteFields(toObject(comment), ['']));
    } catch (error) {
        return next(error);
    }
}

export const getAllComment: RequestHandler = async (_, res: ExtendedResponse, next) => {
    try {
        const comments: LeanDocument<IComment>[] = await Comment.find({isDeleted: false}).lean()
            .populate({ path: 'user', match: { isDeleted: false }})
            .populate({ path: 'post', match: { isDeleted: false }});
        return res.sendJson(200, comments);
    } catch (error) {
        return next(error);
    }
}

export const getCommentById: RequestHandler = async  (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id;
        const comment: LeanDocument<IComment> = await Comment.findOne({ _id: id, isDeleted: false }).lean();
        if (!comment)
            throw new APIError({ status: 404, message: 'No such comment Exists!' });
        return res.sendJson(200, comment);
    } catch (error) {
        return next(error);
    }
}

export const updateComment: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id;
        const requestedUser: Types.RequestedUser = req.user!;
        const commentInfo = await Comment.findOne({ _id: id, isDeleted: false });
        if (commentInfo) {
            if (commentInfo?.user == requestedUser._id) {
                await Comment.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: req.body });
                return res.sendJson(200, "Comment udpated.");
            } else
                throw new APIError({ status: 403, message: "You can't edit other's comment."})
        } else 
            throw new APIError({ status: 404, message: "No such comment exists!" });
    } catch (error) {
        return next(error);
    }
}

export const deleteComment: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id;
        const requestedUser: Types.RequestedUser = req.user!;
        let commentInfo: IComment | null = await Comment.findOne({ _id: id, isDeleted: false });
        let postInfo: IPost | null = await Post.findOne({ _id: commentInfo?._id, isDeleted: false });
        if (commentInfo) {         
            if (postInfo?.user == requestedUser._id || requestedUser.role == 'admin') {
                await Comment.findOneAndUpdate({ _id: commentInfo._id, isDeleted: false}, { $set: { isDeleted: true, deletedBy: requestedUser._id, deletedAt: new Date()}});
                await Post.findOneAndUpdate({ _id: postInfo?._id, isDeleted: false }, { $pull : { comments : id }});
                await User.findOneAndUpdate({ _id: postInfo?.user as string, isDeleted: false }, { $pull : { comments : id }});
            } else {
                if (commentInfo.user == requestedUser._id) {
                    await Comment.findOneAndUpdate({ _id: id, isDeleted: false}, { $set: { isDeleted: true, deletedBy: requestedUser._id, deletedAt: new Date()}});
                    await User.findOneAndUpdate({ _id: postInfo?.user as string, isDeleted: false }, { $pull: { comments: id } });
                    await Post.findOneAndUpdate({ _id: postInfo?._id as string, isDeleted: false }, { $pull: { comments: id } });
                    return res.sendJson(200, {message : "Comment deleted Successfully"})
                } else  
                    throw new APIError({ status: 403, message: "You can't delete others' comments!"});
            }
        } else 
            throw new APIError({ status: 400, message: "No such comment exists!"}); 

    } catch (error) {
        return next(error);
    }
}
