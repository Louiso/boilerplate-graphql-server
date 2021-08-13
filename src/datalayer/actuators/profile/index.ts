import { Types } from 'mongoose'
import StorageActuator from '../storage'
import ProfileModel from '../../models/mongo/profile'
import { IContext } from 'interfaces/general'
import { Profile, QueryUploadCvArgs, QueryGetProfileExhaustiveArgs, MutationUpdateProfileBasicInformationArgs } from 'interfaces/graphql'
import ProfileProgressActuator from '../profileProgress'

const uploadCV = async ({ contentType: ContentType, filename }: QueryUploadCvArgs, context: IContext): Promise<string> => {
  try {
    const { userId } = context
    const profile = await ProfileModel.findOne({ idUser: userId }, {})

    if(!profile) throw new Error('Profile not found')

    const Key = `assets/profile/${profile._id}/cv/${filename}`
    const Bucket = process.env.BUCKET_DIR || ''

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

const updateProfileBasicInformation = async ({ input }: MutationUpdateProfileBasicInformationArgs, context: IContext): Promise<Profile> => {
  try {
    const profile = await ProfileModel
      .findOne({ idUser: context.userId })
      .lean()

    if(!profile) throw new Error(`Profile userId ${context.userId} NotFound`)

    const update: any = {}

    // genera un objeto q permite actualizar los datos hasta segunda capa, no admite array puede generar error
    for (const key in input)
      if(typeof input[key] !== 'object') update[key] = input[key]
      else if(input[key] instanceof Date)  update[key] = input[key]
      else if(!Array.isArray(input[key]))
        for (const subKey in input[key])
          if(typeof input[key][subKey]  !== 'object') update[`${key}.${subKey}`] = input[key][subKey]

    if('docNumber' in input && !('docType' in input))
      update[profile.docType!] = input.docNumber!
    else if(!('docNumber' in input) && 'docType' in input)
      update[input.docType!] = profile.docNumber
    else if('docNumber' in input && 'docType' in input)
      update[input.docType!] = input.docNumber!

    // if('docType' in input && !())
    // update['docType' in input ? input.docType! : profile.docType!] = input.docNumber!

    if('phone' in input)
      update['phones.0.value'] = input.phone

    const profileDb = await ProfileModel
      .findOneAndUpdate(
        {
          idUser: context.userId
        },
        {
          $set: update
        },
        {
          'new': true
        }
      )
      .lean()

    return profileDb!
  } catch (error) {
    throw error
  }
}

export default {
  uploadCV,
  getProfileExhaustive,
  updateProfileBasicInformation
}
