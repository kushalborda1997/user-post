import express from 'express';
import { validate } from 'express-validation';
import hasAuth from '../middlewares/Auth';

import * as USER_HANDLER from '../controllers/user';
import { createUser, getUserById, updateUser, deleteuser } from '../validations/user'

const router = express.Router();

router.get('/', hasAuth(['user']), hasAuth(['admin', 'user']), USER_HANDLER.getAllUser);

router.post('/', validate(createUser), USER_HANDLER.createUser);

router.get('/:id', validate(getUserById), hasAuth(['admin', 'user']), USER_HANDLER.getUserById);

router.put('/:id', validate(updateUser), hasAuth(['user']), USER_HANDLER.updateUser);

router.delete('/:id', validate(deleteuser), hasAuth(['admin', 'user']), USER_HANDLER.deleteUser);

export default router;
