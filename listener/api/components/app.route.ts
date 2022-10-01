import express from 'express'
import { getCities } from './app.components'

const router = express.Router()

router.get('/', getCities)

export { router }