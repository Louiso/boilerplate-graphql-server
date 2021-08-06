// import { NormalizeId } from 'interfaces/general'
import { Document, Schema } from 'mongoose'

import { connection } from '../../config/connections'

const { Types: { ObjectId } } = Schema

const QuestionSchema = new Schema({
  refId    : { type: ObjectId, required: true },
  statement: { type: String },
  answer   : { type: String }
}, { timestamps: true })

const LaborReferentSchema = new Schema({
  experienceId: { type: String },
  fullName    : { type: String },
  email       : { type: String },
  phone       : { type: String },
  companyName : { type: String },
  jobPosition : { type: String },
  questions   : [ QuestionSchema ],
  generated   : { type: Boolean, 'default': false }
}, { timestamps: true })

const BackgroundCheckSchema = new Schema({
  taskId         : { type: ObjectId, required: true },
  jobId          : { type: ObjectId, required: true },
  candidateId    : { type: ObjectId, required: true },
  candidateTaskId: { type: ObjectId, required: true },
  krowderGroupId : { type: ObjectId, required: true },
  userId         : { type: ObjectId, required: true },
  laborReferents : [ LaborReferentSchema ],
  executedAt     : { type: Date }
}, { timestamps: true })

export type BackgroundCheckDb = Document

const BackgroundCheckModel = connection.model<BackgroundCheckDb>('BackgroundCheck', BackgroundCheckSchema)

export default BackgroundCheckModel
