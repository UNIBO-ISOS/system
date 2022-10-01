import { moveToken } from '../../components/camunda/moveToken'
import axios from 'axios'
import { Request, Response } from 'express'

const getCities = async (req: Request, res: Response, next: any) => {
    // unlock token
    await moveToken(process.env.TOKEN_GET_ALL_CITIES!)
    //request
    const response = await axios.get(process.env.ACME_BACKEND! + '/cities')
    return res.status(200).json(response.data)
}

export { getCities }