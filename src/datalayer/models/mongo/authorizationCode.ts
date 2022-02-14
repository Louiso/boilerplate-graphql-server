import { Types, Schema } from 'mongoose'
import { connection } from 'config/connections'

export interface AuthorizationCode {
  _id: Types.ObjectId;
  authorizationCode: string;
  redirectUri: string;
  userId: Types.ObjectId;
  expiresAt: Date;
  scope: string;
  clientId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorizationCodeSchema = new Schema({
  authorizationCode: { type: String, required: true, trim: true },
  clientId         : { type: Schema.Types.ObjectId, ref: 'Client', required: true, trim: true },
  userId           : { type: Schema.Types.ObjectId, ref: 'User', required: true, trim: true },
  expiresAt        : { type: Date, required: true, trim: true },
  scope            : { type: String, required: true, trim: true },
  redirectUri      : { type: String, required: true, trim: true }
}, { timestamps: true })

const AuthorizationCodeModel = connection.model<AuthorizationCode>('AuthorizationCode', AuthorizationCodeSchema)

export default AuthorizationCodeModel
