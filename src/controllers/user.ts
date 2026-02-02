import { RequestHandler} from 'express';
import APIError from '../utils/APIError';
import { LeanDocument} from 'mongoose'

import User,{ IUser } from '../models/user';
import Role from '../models/roles';
import ExtendedResponse from '../interfaces/IExtendedResponse';
import { RequestedUser } from '../types/index';
import { deleteFields, toObject } from '../utils/helper';
import Post from '../models/post';
import Comment from '../models/comment';

export const createUser: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const payload: IUser = req.body;
        const role = await Role.findOne({ name: 'user'});
        
        if (!role)
            throw new APIError({ status: 404, message: "System roles are not created yet!" });
        
        const user: IUser =  await User.create({...payload, role: role._id });
        return res.sendJson(200, deleteFields(toObject(user), ['comments', 'posts', 'password']));   
    } catch (error) {
        return next(error);
    }
}

export const getAllUser: RequestHandler = async (_, res: ExtendedResponse, next) => {
    try {
        const users: LeanDocument<IUser>[] = await User.find({ isDeleted: false }, '-password').lean()
            .populate({ path: 'posts', match: { isDeleted: false }})
        return res.sendJson(200, users);
    } catch (error) {
        return next(error);
    }
}

export const getUserById: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id as string;
        const user: LeanDocument<IUser>| null = await User.findOne({ _id: id, isDeleted: false }, '-password').lean();
        if (!user) throw new APIError({ status: 400, message: "No such Error exists!" });
        return res.sendJson(200, user);
    } catch (error) {
        return next(error);
    }
}

export const updateUser: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id!;
        const RequestedUser: RequestedUser = req.user!;
        const payload = req.body;
        if (RequestedUser._id === id) {
            const user: IUser | null = await User.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: payload }, { new: true });
            if (!user) throw new APIError({ status: 400, message: "No such user exists!" });
            return res.sendJson(200, user);
        } else 
            throw new APIError({ status: 403, message: "You cannot update other users info."})
    } catch (error) {
        return next(error);
    }
}

export const deleteUser: RequestHandler = async (req, res: ExtendedResponse, next) => {
    try {
        const id = req.params.id as string;
        let RequestUser : RequestedUser = req.user!;
        
        if (req.params.id === RequestUser._id || RequestUser.role === 'admin') {
            // const userInfo = await User.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, deletedAt: Date.now(), deletedBy: RequestUser._id }, {new: true});
            const userInfo: IUser | null = await User.findOneAndUpdate({ _id: id, isDeleted: false}, { isDeleted: true, deletedBy: RequestUser._id, deletedAt: new Date()}, {new: true})
            const postList = await Post.find({ isDeleted: false, user: userInfo?._id}, { _id: 1 });
            const list = postList.map(post => post._id);
            await Post.updateMany({ user: userInfo?._id }, { isDeleted: true, deletedBy: RequestUser._id, deletedAt: new Date()});
            await Comment.updateMany({ $or : [ { user : userInfo?._id }, { post: { $in : list }} ]}, { isDeleted: true, deletedBy: RequestUser._id, deletedAt: new Date()})
            return res.sendJson(200, "User Deleted successfully.");
        } else 
            throw new APIError({ status: 403, message: "You can't delete other users." })
    } catch (error) {
        return next(error);
    }
}