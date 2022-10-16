import axios from 'axios'
import { Request, Response, Router } from 'express'
import { createInstance } from '../components/camunda/createInstance'

const router = Router()

// TODO: add businessKey taken from the headers
const unlockMessage = async (messageName: String, businessKey: String) => {
    try {
        await axios.post(`${process.env.CAMUNDA_PLATFORM!}/message/`, {
            messageName,
            businessKey,
            "resultEnabled": true
        })
    } catch (err) {
        console.log(err);
    }
}

router.get('/cities', async (req: Request, res: Response, next: any) => {
    // generare businessKey
    const businessKey = 'bk_' + Date.now()

    // Creare istanza di processo su camunda
    await createInstance(businessKey)

    // inviare messaggio a camunda
    await unlockMessage("Message_askCities", businessKey)

    const data = (await axios.get(`${process.env.ACME_BACKEND!}/cities/`)).data

    res.setHeader(process.env.HEADER_BK!, businessKey).send(data)
})

// TODO: restaurants in specific city
router.get('/restaurants', async (req: Request, res: Response) => {

    let businessKey = req.get(process.env.HEADER_BK!)!

    await unlockMessage("Message_rcvCity", businessKey)

    let cityId = req.query.cityId
    if(cityId) {
        cityId = '?cityId=' + cityId
    }

    const data = (await axios.get(`${process.env.ACME_BACKEND!}/restaurants/${cityId}`)).data

    res.send(data)
})

router.post("/order", async (req: Request, res: Response) => {
    await unlockMessage("Message_rcvOrder", "test")

    const data = (await axios.post(`${process.env.ACME_BACKEND!}/order/`, req.body)).data

    res.send(data)
})

export { router as MainRouter }
