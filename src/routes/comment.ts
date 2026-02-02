import express from 'express';
import { validate } from 'express-validation';
import hasAuth from '../middlewares/Auth';

import * as COMMENT_HANDLER from '../controllers/comment';
import { createComment, upadateComment, deleteComment, getCommentById } from '../validations/comment';

const router = express.Router();

router.get('/', hasAuth(['admin', 'user']), COMMENT_HANDLER.getAllComment);

router.get('/:id', hasAuth(['admin', 'user']), validate(getCommentById), COMMENT_HANDLER.getCommentById);

router.post('/', hasAuth(['admin', 'user']), validate(createComment), COMMENT_HANDLER.createComment);

router.put('/:id', hasAuth(['user', 'admin']), validate(upadateComment), COMMENT_HANDLER.updateComment);

router.delete('/:id', hasAuth(['admin', 'user']), validate(deleteComment), COMMENT_HANDLER.deleteComment);

export default router;