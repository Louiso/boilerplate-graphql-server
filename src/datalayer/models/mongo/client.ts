import { Types, Schema } from 'mongoose'
import { connection } from 'config/connections'
import { GrantTypes } from './grant'

export interface Client {
  _id: Types.ObjectId;
  userId: string;
  grants: string[];
  secret: string;
  name: string;
  redirectUris: string[]; // para futuras implementaciones
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema({
  secret      : { type: String, required: true, trim: true },
  name        : { type: String, required: true, trim: true },
  redirectUris: [ { type: String, required: true, trim: true } ],
  userId      : { type: String, required: true, trim: true },
  grants      : [ { type: String, required: true, trim: true, 'enum': GrantTypes.map((grantType) => grantType.type) } ],
  scope       : { type: String, required: true, trim: true } // el client tiene scope por configuración
}, { timestamps: true })

const ClientModel = connection.model<Client>('Client', ClientSchema)

export default ClientModel
