import { RequestHandler } from 'express';
import { LeanDocument } from 'mongoose';
import * as Types from '../types';
import ExtendedResponse from '../interfaces/IExtendedResponse';
import APIError from "../utils/APIError";
import { deleteFields, toObject } from '../utils/helper';
import User from '../models/user';
import Post, { IPost } from "../models/post";
import Comment from "../models/comment";


export const createPost: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const payload = req.body;
        const requestedUser: Types.RequestedUser = req.user!;
        const post: IPost = await Post.create({...payload, user: requestedUser._id });
        await User.findOneAndUpdate({ _id: requestedUser._id, isDeleted: false}, { $addToSet : { posts: post._id }});
        return res.sendJson(201, deleteFields(toObject(post), ["comments"]));
    } catch (error) {
        return next(error);
    }
} 

export const getAllPost: RequestHandler = async (_, res: ExtendedResponse, next) => {
    try {
        const posts: LeanDocument<IPost>[]  = await Post.find({ isDeleted: false }).lean()
            .populate({ path: 'user', match: { isDeleted: false }})
            .populate({ path: 'comment', match: { isDeleted: false }});
        
        return res.sendJson(200, posts);
    } catch (error) {
        return next(error);
    }
}

export const getPostById: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id;
        const post: LeanDocument<IPost> | null = await Post.findOne({ _id: id, isDeleted: false }).lean()
            .populate({ path: 'user', match: { isDeleted: false }})
            .populate({ path: 'comment', match: { isDeleted: false }});
        if (post)
            return res.sendJson(200, post);
        else 
            throw new APIError({ status: 404, message: 'No such post exists!' });
    } catch (error) {
        return next(error);
    }
}

export const updatePost: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id;
        const reqestedUser: Types.RequestedUser = req.user!;
        const payload = req.body;
        const postInfo = await Post.findOne({ _id: id, isDeleted: false});
        if (postInfo) {
            if (postInfo.user == reqestedUser._id) {
                const post = await Post.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: payload}, {new: true});
                return res.sendJson(200, post);
            } else
                throw new APIError({ status: 403, message: " You can't edit other's post!"});

        } else
            throw new APIError({ status: 400, message: 'No such post exists!'});
    } catch (error) {
        return next(error);
    }
}

export const deletePost: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id;
        const requestUser: Types.RequestedUser = req.user!;
        const postInfo: IPost | null = await Post.findOne({ isDeleted: false, user: requestUser._id });
        if (postInfo) {
            if ((postInfo.user as string) == requestUser._id || requestUser.role === 'admin') {
                await User.findOneAndUpdate({ _id: <string>postInfo.user, isDeleted: false }, { $pull : { posts: id }});
                await Post.findOneAndUpdate({ _id: id, isDeleted: false }, { $set : { isDeleted: true, deletedBy: requestUser._id, deletedAt: new Date()}});
                await Comment.updateMany({ post: postInfo._id }, { $set : { isDeleted: true, deletedBy: requestUser._id, deletedAt: new Date()}})
                return res.sendJson(200, "Post Deleted Successfully.");
            } else 
                throw new APIError({ status: 403, message: "You don't have rights to delete post of others!" })
        } else
            throw new APIError({ status: 400, message: "No such post exists!" });
    } catch (error) {
        return next(error);
    }
}