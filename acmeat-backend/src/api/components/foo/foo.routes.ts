import express from 'express';
import { getFoo } from './foo.controller';


const router = express.Router();

router.get('/', getFoo);

export { router }
