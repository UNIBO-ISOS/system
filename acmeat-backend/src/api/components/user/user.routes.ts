import express from 'express';
import { signUp, login, getAll } from './user.controller';
import { authorize } from '../../middleware/authorize';
import { roles } from '../../middleware/role';


const router = express.Router();

router.post('/', signUp);
router.post('/login', login);
router.get('/', authorize(roles.admin), getAll)

export { router }
