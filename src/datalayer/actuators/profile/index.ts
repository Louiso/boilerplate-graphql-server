import { Types } from 'mongoose'
import StorageActuator from '../storage'
import ProfileModel from '../../models/mongo/profile'
import { IContext } from 'interfaces/general'
import { Profile, QueryUploadCvArgs, QueryGetProfileExhaustiveArgs } from 'interfaces/graphql'
import ProfileProgressActuator from '../profileProgress'

const uploadCV = async ({ contentType: ContentType, filename }: QueryUploadCvArgs, context: IContext): Promise<string> => {
  try {
    const { userId } = context
    const profile = await ProfileModel.findOne({ idUser: userId }, {})

    if(!profile) throw new Error('Profile not found')

    const Key = `assets/profile/${profile._id}/cv/${filename}`
    const Bucket = process.env.AWS_BUCKET || ''

    const token = StorageActuator.generateTokenPut({ ContentType, Key, Bucket })

    return token
  } catch (error) {
    throw error
  }
}

const getProfileExhaustive = async ({ jobId }: QueryGetProfileExhaustiveArgs, context: IContext): Promise<Profile> => {
  try {
    let profile = await ProfileModel
      .findOne({ idUser: context.userId })
      .lean()

    if(jobId)
      await ProfileProgressActuator.getProgressExhaustive({ jobId }, context)

    if(profile) return profile

    const { user, success } = await context.dataSources.accountAPI.getUser(context.userId!)

    if(!success) throw new Error('Error al traer data del usuario')

    profile = await ProfileModel.create({
      emails: [ {
        _id  : Types.ObjectId(),
        type : 'email-principal',
        value: user.email ?? ''
      } ],
      firstName: user.firstName,
      idUser   : context.userId,
      lastName : user.lastName,
      phones   : [ {
        _id  : Types.ObjectId(),
        type : 'phone-principal',
        value: user.phone
      } ],
      photo: user.photo
    })

    return profile
  } catch (error) {
    throw error
  }
}

export default {
  uploadCV,
  getProfileExhaustive
}
