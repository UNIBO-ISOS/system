import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Order, courierSearchStatus, restaurantStatus } from './order.model';
import { myBank } from '../../util/bankWrapper';
import { Types } from 'mongoose';
import { wrapper } from '../../util/socketWrapper';
import { Restaurant } from '../restaurant/restaurant.model';
import { Courier } from '../courier/courier.model';
import { Auction } from '../auction/auction.model';
import { Timer } from '../../util/timer'
import { emitter } from '../../util/emitter'

const createNewOrder = async (req: any, res: Response, next: any) => {
    try {
        let orderRequest = req.body
        orderRequest.userId = new Types.ObjectId(req.auth.user)
        orderRequest.transactionId = 'NOT PAID'
        orderRequest.restaurantStatus = restaurantStatus.PENDING
        orderRequest.courierSearchStatus = courierSearchStatus.PENDING
        orderRequest.date = (new Date(Date.now())).toISOString()

        const orderToSave = new Order(orderRequest)
        orderToSave.save()

        // notify restaurant
        const restaurant = await Restaurant.findById(orderToSave.restaurantId.toString())
        if(!restaurant) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND })
        }
        wrapper.emit([restaurant.user.toString()], process.env.NEW_ORDER_RESTAURANTS!, orderToSave)

        // notify courier
        const courierPoint = orderToSave.address.location
        const couriers = await Courier.find({
            $near: {
                $geometry: courierPoint,
                $maxDistance: parseInt(process.env.MAX_DISTANCE!)
            }
        })
        if(!couriers) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND })
        }
        for(const courier of couriers) {
            wrapper.emit([courier.user.toString()], process.env.NEW_ORDER_COURIERS!, orderToSave)
        }

        emitter.addEvent(orderToSave._id.toString(), async () => {
            //  todo: selezionare corriere dalla lista disponibile (se esiste)

            const confirmedDeliveries = await Auction.find({
                orderId: orderToSave._id
            }).sort({"amount":1})

            const bestOfDeliveries = confirmedDeliveries[0];

            let successMsg = {
                deliveryId: bestOfDeliveries.orderId,
                success: true
            }

            const userCourier = await Courier.findById(bestOfDeliveries.courierId.toString())
            if(!userCourier){
                return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND})
            }

            wrapper.emit([userCourier.user.toString()], process.env.WON_COURIER_AUCTION!, successMsg)
        })
        let timer = new Timer(orderToSave._id.toString())

        return res.status(StatusCodes.CREATED).json({ id: orderToSave._id })
    } catch (err) {
        return next(err)
    }
}

const notifyPayment = async (req: any, res: Response, next: any) => {
    try {
        const token = req.body.token
        const orderId = req.params.orderId

        const document = await Order.findById(orderId)
        if(!document) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND})
        }

        const isPaid = await myBank.verifyTransaction(token, document.amount)
        if(!isPaid) {
            return res.status(StatusCodes.PRECONDITION_FAILED).json({ error: ReasonPhrases.PRECONDITION_FAILED})
        }

        document.transactionId = token
        await document.save()

        return res.status(StatusCodes.CREATED).json({ id: document._id })
    } catch (err) {
        return next(err)
    }
}

const acceptOrder = async (req: any, res: Response, next: any) => {
    try {
        const orderId = req.params.orderId

        let document = await Order.findById(orderId)
        if(!document) {
            return res.status(StatusCodes.NOT_FOUND).json({error: ReasonPhrases.NOT_FOUND})
        }

        document.restaurantStatus = restaurantStatus.ACCEPTED
        const doc = await document.save()

        return res.status(StatusCodes.ACCEPTED).json({ id: doc._id })
    } catch (err) {
        return next(err)
    }
}

const rejectOrder = async (req: any, res: Response, next: any) => {
    try {
        const orderId = req.params.orderId

        let document = await Order.findById(orderId)
        if(!document) {
            return res.status(StatusCodes.NOT_FOUND).json({error: ReasonPhrases.NOT_FOUND})
        }

        document.restaurantStatus = restaurantStatus.REJECTED
        const doc = await document.save()

        return res.status(StatusCodes.ACCEPTED).json({ id: doc._id })
    } catch (err) {
        return next(err)
    }
}

const cancelOrder = async (req: any, res: Response, next: any) => {
    try {
        const orderId = req.params.orderId

        let document = await Order.findById(orderId)
        if(!document) {
            return res.status(StatusCodes.NOT_FOUND).json({error: ReasonPhrases.NOT_FOUND})
        }

        document.restaurantStatus = restaurantStatus.REJECTED
        const doc = await document.save()

        return res.status(StatusCodes.ACCEPTED).json({ id: doc._id })
    } catch (err) {
        return next(err)
    }
}

const acceptDelivery = async (req: any, res: Response, next: any) => {
    try {
        const timeReceived = new Date(Date.now())
        
        const orderId = req.params.orderId

        const courierId = await Courier.findOne({
            user: new Types.ObjectId(req.auth.user)
        })
        if(!courierId) {
            return res.status(StatusCodes.NOT_FOUND).json({error: ReasonPhrases.NOT_FOUND})
        }

        const deliveryId = req.body.deliveryId
        const amount = req.body.amount
        
        let document = await Order.findById(orderId) 
        if(!document) {
            return res.status(StatusCodes.NOT_FOUND).json({error: ReasonPhrases.NOT_FOUND})
        }
        
        const timeCreated = new Date(""+document.date+"")
        
        if ((timeReceived.getTime() - timeCreated.getTime()) / 1000 <= 15){
            let auction = new Auction({ 
                orderId: orderId, 
                courierId: courierId,
                amount: amount,
                receiveDate: timeReceived.getTime()
            });

            const AuctionObject = new Auction(auction)
            const doc = await AuctionObject.save()
            
            return res.status(StatusCodes.CREATED).json({ id: doc._id })
        }

        //  TODO: restituire codice corretto 
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ msg: 'order timeout'})
    } catch (err) {
        return next(err)
    }
}

export { createNewOrder, notifyPayment, acceptOrder, rejectOrder, cancelOrder, acceptDelivery }