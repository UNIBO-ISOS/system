import bodyParser from 'body-parser'
import express from 'express'
import CourierRouter from './router'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(CourierRouter)

app.listen(5003, () => {
    console.log('Restaurant service running on port 5002')
})