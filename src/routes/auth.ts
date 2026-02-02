import { Router } from 'express';

import * as AUTH_HANDLER from '../controllers/auth'; 

const router = Router();

router.post('/login', AUTH_HANDLER.loginHandler);

export default router;