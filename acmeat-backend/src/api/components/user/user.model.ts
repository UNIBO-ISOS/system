import { Schema, model } from 'mongoose';
import { roles } from '../../middleware/role';

interface IUser {
    username: String,
    firstName: String,
    lastName: String,
    role: String,
    password: String,
    salt: String
}

const userSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true, enum: roles },
    password: { type: String, required: true },
    salt: { type: String, required: true }
});

const User = model<IUser>('user', userSchema, 'user');

export { User }