import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { City } from './city.model';


const getAllCities = async (req: Request, res: Response, next: any) => {
    try {
        const documents = await City.find({});
        return res.status(StatusCodes.OK).json({ cities: documents })
    } catch (err) {
        return next(err)
    }
}

export { getAllCities }