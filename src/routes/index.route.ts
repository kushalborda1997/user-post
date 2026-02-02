import { Router } from 'express';

import UserRoutes from './user';
import AuthRoutes from './auth';
import PostRoutes from './post';
import CommentRoute from './comment';
import '../middlewares/passport';

const router = Router();

router.use('/api/auth', AuthRoutes);

router.use('/api/user', UserRoutes);

router.use('/api/post', PostRoutes);

router.use('/api/comment', CommentRoute);


export default router;