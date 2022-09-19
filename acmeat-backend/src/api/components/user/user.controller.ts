import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { User } from './user.model';
import { generateSalt, hashPassword } from '../../util/util';
import { roles } from '../../middleware/role';
import { sign } from 'jsonwebtoken';


const signUp = async (req: Request, res: Response, next: any) => {
    try {
        const salt = generateSalt();
        const object = hashPassword(req.body.password, salt)
        let user = req.body
        user.salt = object.salt
        user.password = object.hashPassword
        user.role = roles.normal
        
        const userToSave = new User(user)
        const doc = await userToSave.save()
        return res.status(StatusCodes.CREATED).json({ id: doc._id })
    } catch (err) {
        return next(err)
    }
}

const login = async (req: Request, res: Response, next: any) => {
    const query = {
        username: req.body.username
    }
    try {
        const document = await User.findOne(query)
        if(!document) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: 'Account not found'})
        }
        const salt = document.salt
        const hashedPassword = hashPassword(req.body.password, salt.toString())
        if(hashedPassword.hashPassword === document.password) {
            const token = sign({ user: document._id, role: document.role }, process.env.SECRET!, { expiresIn: '12h' })
            return res.status(StatusCodes.OK).json({ token: token })
        }
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'username or password incorrect' })
    } catch(err) {
        return next(err)
    }
}

const getAll = async (req: Request, res: Response, next: any) => {
    try{
        const documents = await User.find({}, {username: true, firstName: true, lastName: true, role: true, salt: true, password: true})
        return res.status(StatusCodes.OK).json({ users: documents })
    } catch (err) {
        next(err)
    }
}

export { signUp, login, getAll }