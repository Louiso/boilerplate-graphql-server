import StorageActuator from '../storage'
import ProfileModel from '../../models/mongo/profile'
import { IContext } from 'interfaces/general'
import { QueryUploadCvArgs } from 'interfaces/graphql'

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

export default {
  uploadCV
}
