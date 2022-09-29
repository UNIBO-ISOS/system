import { randomBytes, createHmac } from 'crypto';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Order } from '../components/order/order.model';

const generateSalt = () => {
    const length = parseInt(process.env.LENGTH_SALT!);

    return randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length)
}

const hashPassword = (password: string, salt: string) => {
    const hash = createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');

    return {
        salt: salt,
        hashPassword: value
    }
}

const checkDeadline = async (req: Request, res: Response, next: any) => {
    const deadLineToday = new Date()
    deadLineToday.setHours(10, 0, 0, 0)
    const deadlineMillis = deadLineToday.getMilliseconds()

    const nowMillis = Date.now()

    // check if the menù of the restaurants is updated before the 10:00am
    if(nowMillis > deadlineMillis) { 
        return res.status(StatusCodes.PRECONDITION_FAILED).json({ error: ReasonPhrases.PRECONDITION_FAILED})
    }

    next()
}

const checkCancelOrderDeadline = async (req: Request, res: Response, next: any) => {
    const requestReceivedTime = new Date(Date.now())
    const timeReceived = requestReceivedTime.getHours() + "" + requestReceivedTime.getMinutes()
    
    const orderId = req.params.orderId

    let order = await Order.findById(orderId)
    if(!order){
        return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND })
    }

    const deliveryTime = order.deliveryTime
    const timeRemaining = Number(deliveryTime) - Number(timeReceived)

    //  check if there are more then 60 minutes since the deadline 
    //  100 units stands for 1 entire hour
    if(timeRemaining <= 100) {
        return res.status(StatusCodes.NOT_ACCEPTABLE).json({ error: ReasonPhrases.NOT_ACCEPTABLE, reason: 'You passed the 1hour deadline'})
    }
    
    return next()
}

const checkUnavailability = async (req: Request, res: Response, next: any) => {
    const deadLineToday = new Date()
    deadLineToday.setHours(10, 0, 0, 0)
    const todayMillis = deadLineToday.getMilliseconds()

    const nowMillis = Date.now()

    // if the unavailability is the current day the notification must be done before 10:00am
    if(!req.body.date && nowMillis > todayMillis) { 
        return res.status(StatusCodes.PRECONDITION_FAILED).json({ error: ReasonPhrases.PRECONDITION_FAILED})
    }

    if(req.body.date) {
        const bodyDate = new Date(req.body.date)
        bodyDate.setHours(0, 0, 0, 0)

        deadLineToday.setHours(0, 0, 0, 0)
        deadLineToday.setDate(deadLineToday.getDate() + 1)

        // if the day is specified in the body of the request, check if that day is already passed
        if(bodyDate.getMilliseconds < deadLineToday.getMilliseconds) {
            return res.status(StatusCodes.PRECONDITION_FAILED).json({ error: ReasonPhrases.PRECONDITION_FAILED })
        }
    }

    return next()
}

export { generateSalt, hashPassword, checkDeadline, checkUnavailability, checkCancelOrderDeadline }