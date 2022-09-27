import express, { Express, Request, Response, ErrorRequestHandler } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';

// socket.io
import http from 'http';
import { Server } from 'socket.io';
import { authenticate } from 'socketio-jwt-auth';
import { wrapper } from './api/util/socketWrapper';
import { roles } from './api/middleware/role';

// load environment

dotenv.config();

import util from 'util';

import { connectToDatabase } from "./database/connection"

// import API
import { router as api } from "./api/index"
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

app.use(api);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    console.log(err)

    if(err instanceof mongoose.Error.ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({error: 'Validation Error (MongoDB)'})
    }

    if(err.name === 'MongoServerError' && err.code === 11000){
        return res.status(StatusCodes.CONFLICT).json({error: 'Duplicate'})
    }

    if(err.name === 'UnauthorizedError') {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid Token' })
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: ReasonPhrases.INTERNAL_SERVER_ERROR })
}
app.use(errorHandler)

process.on('unhandledRejection', (reason, promise) => {
    const promiseString = util.inspect(promise, true);
    const reasonString = util.inspect(reason, true);
    const log = util.format('LOG: Unhandled rejection at %s reason %s', promiseString, reasonString)
    console.log(log)
})

process.on('uncaughtException', (error, origin) => {
    const errorString = util.inspect(error, true);
    const log = util.format('LOG: Caught exception: %s\n Exception origin: %s', errorString, origin)
    console.log(log)
})

connectToDatabase()

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
      }
});

// set up socket authentication
io.use(authenticate({
    secret: process.env.SECRET!
}, (payload, done) => {
    if(!payload || (payload.role != roles.restaurant && payload.role != roles.courier)) {
        return done(new Error(ReasonPhrases.UNAUTHORIZED), false, ReasonPhrases.UNAUTHORIZED)
    }
    return done(null, payload)
}))

// accept all peers that have been authenticated through JWT
io.on('connection', (socket: any) => {

    console.log('peer authenticated!')
    wrapper.addSocket(socket.request.user.user, socket)

    socket.on('disconnect', (socket: any) => {
        console.log('peer disconnected!')
    })
})

// express, listen for new connections
server.listen(port, () => {
    console.log(`Running on ${port} (ACMEat API)`);
})

export { io }