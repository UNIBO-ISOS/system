import express from 'express';
import { getAllRestaurants, updateRestaurants, notifyUnavailability, getRestaurant } from './restaurant.controller';
import { authorize, checkOwnership } from '../../middleware/authorize';
import { roles } from '../../middleware/role';
import { checkDeadline, checkUnavailability } from '../../util/util';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/:restaurantId', getRestaurant)
// update menu of restaurant
router.post('/:restaurantId', checkDeadline, authorize(roles.restaurant), checkOwnership, updateRestaurants);
//notify unavailability
router.post('/:restaurantId/notifyUnavailability', checkUnavailability, authorize(roles.restaurant), checkOwnership, notifyUnavailability)

export { router }
