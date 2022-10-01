import { Client, logger } from 'camunda-external-task-client-js'
import dotenv from 'dotenv'
import { init } from './components/init_subscribe'
import express, { Express } from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { router as API } from './api/index'

// load environment
dotenv.config()

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: process.env.CAMUNDA_PLATFORM!, use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

init()

const port = process.env.PORT!
const app: Express = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: true }))

app.use(API)

app.listen(port, () => {
    console.log(`Running on ${port} (LISTENER API)`);
})

export { client }