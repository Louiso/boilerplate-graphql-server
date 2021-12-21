import { Schema, Document, Types } from 'mongoose'
import { Career } from 'interfaces/graphql'
import { connection } from '../../../config/connections'
import { NormalizeId } from 'interfaces/general'

export type CareerDB = Document & NormalizeId<Career>

const { ObjectId } = Types

export const careerSchema = new Schema({
  profileId  : { trim: true, type: ObjectId },
  code       : { trim: true, type: String },
  name       : { trim: true, type: String },
  cluster    : { type: String },
  iconCluster: { type: String },
  description: { type: String },
  search     : { trim: true, type: String },
  view       : { trim: true, type: String },
  createdAt  : { type: Date, 'default': Date.now },
  updatedAt  : { type: Date, 'default': Date.now }
})

const CareerModel = connection.model<CareerDB>('Career', careerSchema)

export default CareerModel
