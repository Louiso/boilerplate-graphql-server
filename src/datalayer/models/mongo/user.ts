import { Types, Schema } from 'mongoose'
import { connection } from 'config/connections'

export interface User {
  _id: Types.ObjectId;
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName : { type: String, trim: true },
  email    : { type: String, required: true, trim: true, unique: true },
  password : { type: String, required: true, trim: true },
  photo    : { type: String }
}, { timestamps: true })

const UserModel = connection.model<User>('User', UserSchema)

export default UserModel
