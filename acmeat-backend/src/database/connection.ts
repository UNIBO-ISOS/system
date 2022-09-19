import mongoose, { ConnectOptions } from "mongoose";
import { seed } from './mongo.seed';
import { User } from '../api/components/user/user.model'
import { roles } from '../api/middleware/role'

export async function connectToDatabase() {
    const uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}?authsource=admin`
    console.log(uri)
    const options = {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions
    try{
        await mongoose.connect(uri, options)
    } catch(err) {
        console.log('Initial connection error!')
    }
}

mongoose.connection.on('connected', () => {
    console.log('db connected!')
    //check if the initial data is already inserted in the db
    User.find({ role: roles.admin }).then(documents => {
        if(documents.length == 0) {
            seed()
        }
    })
    .catch(err => {
        console.log(err)
    })
})

mongoose.connection.on('error', err => {
    console.log('db error: ', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('db disconnected!')
})