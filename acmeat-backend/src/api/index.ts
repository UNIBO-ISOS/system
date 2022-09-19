import express from 'express';
import { router as fooRoute } from './components/foo/foo.routes';
import { router as cityRouter } from './components/city/city.routes';
import { router as restaurantRouter } from './components/restaurant/restaurant.routes';
import { router as userRouter } from './components/user/user.routes';
import { router as orderRouter } from './components/order/order.routes';

const router = express.Router();

router.use('/foo', fooRoute);
router.use('/cities', cityRouter);
router.use('/restaurants', restaurantRouter);
router.use('/users', userRouter);
router.use('/orders', orderRouter);

export { router };