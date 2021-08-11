import { IContext } from 'interfaces/general'
import { ProfileProgress, QueryGetProgressExhaustiveArgs, SectionCode } from 'interfaces/graphql'
import ProfileProgressModel from 'models/mongo/profileProgress'
import ProfileModel from 'models/mongo/profile'

const getProgressExhaustive = async ({ jobId }: QueryGetProgressExhaustiveArgs, context: IContext): Promise<ProfileProgress> => {
  try {
    const profile = await ProfileModel
      .findOne({
        idUser: context.userId
      })
      .lean()

    if(!profile) throw new Error(`Profile para este userId ${context.userId} NotFound`)

    let progress = await ProfileProgressModel
      .findOne({
        profileId: profile._id,
        jobId
      })
      .lean()

    if(progress) return progress

    progress = await ProfileProgressModel.create({
      sections: [ {
        code       : SectionCode.BasicInformation,
        isCompleted: false
      }, {
        code       : SectionCode.LinkedinProfile,
        isCompleted: false
      }, {
        code       : SectionCode.Cv,
        isCompleted: false
      }, {
        code       : SectionCode.Experiences,
        isCompleted: false
      }, {
        code       : SectionCode.Referents,
        isCompleted: false
      }, {
        code       : SectionCode.Studies,
        isCompleted: false
      }, {
        code       : SectionCode.AdditionalInformation,
        isCompleted: false
      } ]
    })

    if(!progress) throw new Error('Error al crear progreso')

    return ProfileProgressModel
      .findByIdAndUpdate(
        progress._id,
        {
          $set: {
            currentSectionId: progress.sections[0]._id
          }
        },
        {
          'new': true
        }
      )
      .lean()
  } catch (error) {
    throw error
  }
}

export default {
  getProgressExhaustive
}
