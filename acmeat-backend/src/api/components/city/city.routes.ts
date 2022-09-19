import express from 'express';
import { getAllCities } from './city.controller';


const router = express.Router();

router.get('/', getAllCities);

export { router }
