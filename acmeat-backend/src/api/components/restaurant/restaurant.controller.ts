import { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import { Types } from 'mongoose';
import { Restaurant, Calendar } from './restaurant.model';

const getAllRestaurants = async (req: Request, res: Response, next: any) => {
    try {
        const start = new Date()
        start.setHours(0, 0, 0, 0)

        const end = new Date()
        end.setHours(23, 59, 59, 99)
        

        const todayUnavailability = await Calendar.find({ date: { $gte: start.toISOString(), $lt: end.toISOString() }}, { id_restaurant: true })

        let query: any = {
             _id: { $nin: todayUnavailability.map((item) => { return item.id_restaurant }) }
        }

        if(req.query.cityId) {
            const cityId: string = req.query.cityId.toString()
            query.city = new Types.ObjectId(cityId)
        }

        if(req.query.search) {
            query.name = new RegExp(req.query.search.toString(), 'i')
        }

        if(req.query.lat && req.query.lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(req.query.lat.toString()), parseFloat(req.query.lng.toString()) ]
                    },
                    $minDistance: req.query.minDistance ? parseInt(req.query.minDistance.toString()) : parseInt(process.env.MIN_DISTANCE!),
                    $maxDistance: req.query.maxDistance ? parseInt(req.query.maxDistance.toString()) : parseInt(process.env.MAX_DISTANCE!)
                }
            }
        }

        const documents = await Restaurant.find(query)
            .populate('city')

        return res.status(StatusCodes.OK).json({ restaurants: documents })
    } catch (err) {
        return next(err)
    }
}

const updateRestaurants = async (req:Request, res: Response, next: any) => {
    try {
        const document = req.body
        const idRestaurant = req.params.restaurantId

        const updatedDocument = await Restaurant.findOneAndUpdate({ _id: idRestaurant }, document, { runValidators: true})

        if(!updatedDocument) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: ReasonPhrases.NOT_FOUND })
        }

        return res.status(StatusCodes.OK).json({ id: updatedDocument._id })

    } catch (err) {
        return next(err);
    }
}

const notifyUnavailability = async (req: Request, res: Response, next: any) => {
    try {
        let document = req.body
        const idRestaurant = req.params.restaurantId

        document.id_restaurant = idRestaurant

        const unavailabilityToSave = new Calendar(document)
        const doc = await unavailabilityToSave.save()

        return res.status(StatusCodes.CREATED).json({ id: doc._id })
    } catch (err) {
        return next(err)
    }
}

const getRestaurant = async (req: Request, res: Response, next: any) => {
    try {
        const restaurantId = req.params.restaurantId

        const restaurant = await Restaurant.findById(restaurantId)

        if(!restaurant) {
            return res.status(StatusCodes.OK).json({ error: ReasonPhrases.NOT_FOUND})
        }

        return res.status(StatusCodes.OK).json({ restaurant: restaurant })

    } catch (err) {
        return next(err)
    }
}

export { getAllRestaurants, updateRestaurants, notifyUnavailability, getRestaurant }