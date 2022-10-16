import express from 'express';
import { authorize } from '../../middleware/authorize';
import { roles } from '../../middleware/role';
import { checkCancelOrderDeadline } from '../../util/util';
import { acceptDelivery, acceptOrder, cancelOrder, createNewOrder, notifyPayment, rejectOrder } from './order.controller';

const router = express.Router();

//  TODO: IMPOSTARE I RUOLI GIUSTI
router.post('/', authorize(roles.normal), createNewOrder);
router.post('/:orderId/notifyPayment', authorize(roles.normal), notifyPayment)
router.post('/:orderId/acceptOrder', authorize(roles.normal), acceptOrder)
router.post('/:orderId/rejectOrder', authorize(roles.normal), rejectOrder)
router.post('/:orderId/cancelOrder', authorize(roles.normal), checkCancelOrderDeadline, cancelOrder)
router.post('/:orderId/acceptDelivery', authorize(roles.courier), acceptDelivery)
router.post('/:orderId/notifyRestaurant', authorize(roles.courier), acceptDelivery)
router.post('/:orderId/notifyCourier', authorize(roles.courier), acceptDelivery)

export { router };

