import { Request, Response } from 'express';
import { expressjwt as jwt } from 'express-jwt';
import { Restaurant } from '../components/restaurant/restaurant.model'
import { Order } from '../components/order/order.model'
import { Types } from 'mongoose';
import { IGetUserAuthInfoRequest} from '../../enhanceTS/enhancedefinition'
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
const secret = process.env.SECRET!;

const authorize = (roles: [string] | string) => {
    if(typeof roles === 'string') {
        roles = [roles]
    }

    return [
        jwt({ secret, algorithms: ['HS256'] }),
        (req: any, res: Response, next: any) => {
            if(roles.length && !roles.includes(req.auth.role)) {
                return res.status(401).json({ error: 'Unauthorized' })
            }
            next();
        }
    ]
}

const checkOwnership = async (req: any, res: Response, next: any) => {
    const idToCheck = req.auth.user
    const restaurantId = req.params.restaurantId

    const document = await Restaurant.find({
        user: new Types.ObjectId(idToCheck),
        _id: new Types.ObjectId(restaurantId)
    })

    if(!document || document.length === 0) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: ReasonPhrases.FORBIDDEN })
    }
    return next()
}

const checkOrderOwnership = async (req: any, res: Response, next: any) => {
    const idToCheck = req.auth.user
    const orderId = req.params.orderId

    const document = await Order.find({
        userId: new Types.ObjectId(idToCheck),
        _id: new Types.ObjectId(orderId)
    })

    if(!document || document.length === 0) {
        return res.status(StatusCodes.FORBIDDEN).json({ error: ReasonPhrases.FORBIDDEN })
    }
    return next()
}

export { authorize, checkOwnership, checkOrderOwnership }