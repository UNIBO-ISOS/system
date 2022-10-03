import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { City } from './city.model';


const getAllCities = async (req: Request, res: Response, next: any) => {
    try {
        let query: any = {}
        if(req.query.search) {
            query.name = new RegExp(req.query.search.toString(), 'i')
        }
        const documents = await City.find(query);
        return res.status(StatusCodes.OK).json({ cities: documents })
    } catch (err) {
        return next(err)
    }
}

export { getAllCities }