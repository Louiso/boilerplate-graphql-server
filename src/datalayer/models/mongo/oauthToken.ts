import { Types, Schema } from 'mongoose'
import { connection } from 'config/connections'

export interface OauthToken {
  _id: Types.ObjectId;
  accessToken: string;
  clientId: Types.ObjectId;
  userId: Types.ObjectId;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
}

const OauthTokenSchema = new Schema({
  accessToken          : { type: String, required: true, trim: true },
  clientId             : { type: Schema.Types.ObjectId, ref: 'Client', required: true, trim: true },
  userId               : { type: Schema.Types.ObjectId, ref: 'User', required: true, trim: true },
  accessTokenExpiresAt : { type: Date, required: true, trim: true },
  scope                : { type: String, required: true, trim: true },
  // el OauthToken tiene scope por se le otorga en ese instante y en caso quiera ejecutar
  // algo fuera de su scope debería invalidarse el Oauthtoken
  refreshToken         : { type: String, trim: true },
  refreshTokenExpiresAt: { type: Date, trim: true }
}, { timestamps: true })

const OauthTokenModel = connection.model<OauthToken>('OauthToken', OauthTokenSchema)

export default OauthTokenModel
