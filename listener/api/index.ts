import express from 'express'
import { router as getCitiesRouter } from './components/app.route'

const router = express.Router()

router.use('/cities', getCitiesRouter)

export { router }