import { Client, logger } from 'camunda-external-task-client-js'
import dotenv from 'dotenv'
import { init } from './components/init_subscribe'

// load environment
dotenv.config()

// configuration for the Client:
//  - 'baseUrl': url to the Process Engine
//  - 'logger': utility to automatically log important events
const config = { baseUrl: process.env.CAMUNDA_PLATFORM!, use: logger };

// create a Client instance with custom configuration
const client = new Client(config);

init()

export { client }