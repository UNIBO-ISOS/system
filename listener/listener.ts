import bodyParser from 'body-parser';
import { Client, logger } from 'camunda-external-task-client-js';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { MainRouter } from './api/router';
import { init } from './components/init_subscribe';

// load environment
dotenv.config()

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
//  - 'interval': interval of time to wait before make a new poll (in ms)
const config = { baseUrl: process.env.CAMUNDA_PLATFORM!, use: logger, interval: parseInt(process.env.POLL_INTERVAL!) };

// create a Client instance with custom configuration
const client = new Client(config);

init()

const port = process.env.PORT!
const app = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(MainRouter)

app.listen(port, () => {
    console.log(`Running on ${port} (LISTENER API)`);
})

export { client };
