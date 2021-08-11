import { NormalizeId } from 'interfaces/general'
import { Document, Schema } from 'mongoose'
import { ProfileProgressDbObject, SectionCode } from 'interfaces/graphql'

import { connection } from '../../../config/connections'

const { Types: { ObjectId } } = Schema

export type ProfileProgressDb = Document & NormalizeId<ProfileProgressDbObject>

const ProfileProgressSchema = new Schema<ProfileProgressDb>({
  profileId: { type: ObjectId, ref: 'Profile' },
  jobId    : { type: ObjectId },
  sections : [ {
    isCompleted: { type: Boolean },
    code       : { type: String, 'enum': Object.values(SectionCode) }
  } ],
  currentSectionId: { type: ObjectId }
}, { timestamps: true })

const ProfileProgressModel = connection.model<ProfileProgressDb>('ProfileProgress', ProfileProgressSchema)

export default ProfileProgressModel
