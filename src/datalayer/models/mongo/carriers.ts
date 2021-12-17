import { Schema, Document, Types } from 'mongoose'
import { Carriers } from 'interfaces/graphql'
import { connection } from '../../../config/connections'
import { NormalizeId } from 'interfaces/general'

export type CarrierDB = Document & NormalizeId<Carriers>

const { ObjectId } = Types

export const carrierSchema = new Schema({
  profileId: { trim: true, type: ObjectId },
  code     : { trim: true, type: String },
  name     : { trim: true, type: String },
  search   : { trim: true, type: String },
  view     : { trim: true, type: String },
  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
})

const CarrierModel = connection.model<CarrierDB>('Carrier', carrierSchema)

export default CarrierModel
