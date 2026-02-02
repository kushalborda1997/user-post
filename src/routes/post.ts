import express from 'express';
import { validate } from 'express-validation';
import hasAuth from '../middlewares/Auth';

import * as POST_HANDLER from '../controllers/post';
import { createPost, updatePost, deletePost, getPostById } from '../validations/post';

const router = express.Router();

router.get('/', hasAuth(['admin', 'user']), POST_HANDLER.getAllPost);

router.get('/:id', hasAuth(['admin', 'user']), validate(getPostById), POST_HANDLER.getPostById);

router.post('/', hasAuth(['admin', 'user']), validate(createPost), POST_HANDLER.createPost);

router.put('/:id', hasAuth(['user', 'admin']), validate(updatePost), POST_HANDLER.updatePost);

router.delete('/:id', hasAuth(['admin', 'user']), validate(deletePost), POST_HANDLER.deletePost);

export default router;