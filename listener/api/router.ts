import axios from 'axios'
import { Request, Response, Router } from 'express'

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

    // inviare messaggio a camunda
    await unlockMessage("Message_askCities", "test")

    const data = (await axios.get(`${process.env.ACME_BACKEND!}/cities/`)).data

    res.send(data)
})

// TODO: restaurants in specific city
router.get('/restaurants', async (req: Request, res: Response) => {
    await unlockMessage("Message_rcvCity", "test")

    const data = (await axios.get(`${process.env.ACME_BACKEND!}/restaurants/`)).data

    res.send(data)
})

router.post("/order", async (req: Request, res: Response) => {
    await unlockMessage("Message_rcvOrder", "test")

    const data = (await axios.post(`${process.env.ACME_BACKEND!}/order/`, req.body)).data

    res.send(data)
})

export { router as MainRouter }
