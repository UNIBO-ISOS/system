import express from 'express';
import { acceptOrder, acceptDelivery, createNewOrder, notifyPayment, rejectOrder, cancelOrder } from './order.controller';
import { authorize, checkOrderOwnership } from '../../middleware/authorize';
import { roles, getAllRoles } from '../../middleware/role';
import { checkCancelOrderDeadline } from '../../util/util'

const router = express.Router();

//  TODO: IMPOSTARE I RUOLI GIUSTI
router.post('/', authorize(roles.normal), createNewOrder);
router.post('/:orderId/notifyPayment', authorize(roles.normal), notifyPayment)
router.post('/:orderId/acceptOrder', authorize(roles.normal), acceptOrder)
router.post('/:orderId/rejectOrder', authorize(roles.normal), rejectOrder)
router.post('/:orderId/cancelOrder', authorize(roles.normal), checkCancelOrderDeadline, cancelOrder)
router.post('/:orderId/acceptDelivery', authorize(roles.courier), acceptDelivery)

export { router }
