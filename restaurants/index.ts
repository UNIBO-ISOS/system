import bodyParser from 'body-parser'
import express from 'express'
import RestaurantRouter from './router'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(RestaurantRouter)

app.listen(5002, () => {
    console.log('Restaurant service running on port 5002')
})