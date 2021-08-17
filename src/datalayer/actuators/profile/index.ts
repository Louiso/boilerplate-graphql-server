import { Types } from 'mongoose'
import ProfileModel from '../../models/mongo/profile'
import { IContext } from 'interfaces/general'
import {
  Profile,
  QueryGetProfileExhaustiveArgs,
  MutationUpdateProfileBasicInformationArgs,
  QueryGetAreasArgs,
  MutationUpdateCvArgs,
  Area,
  MutationSendProfileArgs
} from 'interfaces/graphql'
import ProfileProgressActuator from '../profileProgress'

// interface Elements {
//   testing: boolean;
// }

const getProfileExhaustive = async ({ jobId }: QueryGetProfileExhaustiveArgs, context: IContext): Promise<Profile> => {
  try {
    let profile = await ProfileModel
      .findOne({ idUser: context.userId! })
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
    } as any)

    return profile
  } catch (error) {
    throw error
  }
}

const getAreas = async ({ input } : QueryGetAreasArgs, context: IContext): Promise<Array<Area>> => {
  try {
    const { success, data } =  await context.dataSources.gatsAPI.getAreas(input) || {}
    if(!success) return []

    return data
  } catch (error) {
    throw error
  }
}

const updateProfileBasicInformation = async ({ input }: MutationUpdateProfileBasicInformationArgs, context: IContext): Promise<Profile> => {
  try {
    const profile = await ProfileModel
      .findOne({ idUser: context.userId! })
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
          idUser: context.userId!
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

const updateCV = async ({ input }: MutationUpdateCvArgs, context: IContext): Promise<Profile> => {
  try {
    const profile = await ProfileModel
      .findOne({ idUser: context.userId! })
      .lean()

    if(!profile) throw new Error(`Profile userId ${context.userId} NotFound`)

    const profileDb = await ProfileModel
      .findOneAndUpdate(
        {
          idUser: context.userId!
        },
        {
          $set: {
            curriculum: input
          }
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

const checkProfile = async (context: IContext): Promise<{ errors: string[]; profile: Profile; }> => {
  const errors: string[] = []

  const profile = await ProfileModel
    .findOne({ idUser: context.userId! })
    .lean()

  if(!profile) throw new Error(`Profile userId: ${context.userId} NotFound`)

  try {
    const [ firstPhone ] = profile.phones
    if(firstPhone && firstPhone.value && /[a-z]/gi.test(firstPhone.value!)) errors.push('Numero telefónico invalido')

    if(!profile.birthDate) errors.push('Fecha de nacimiento requerido')

    if(profile.salaryExpectation?.amount === null || profile.salaryExpectation?.amount === undefined) errors.push('Expectativa salarial requerida')

    if(!Object.values(profile.curriculum ?? {}).length) errors.push('Curriculum invalido')

    if(!profile.curriculum?.url) errors.push('Curriculum requerido')

    if(profile.curriculum?.url && profile.curriculum?.url.indexOf(profile._id) === -1) errors.push('Curriculum requerido')

    const incompleteExperiences = (profile.experience || [])
      .filter((exp) =>
        !exp.jobPosition ||
        !exp.hierarchy ||
        !exp.companyName ||
        !exp.area ||
        (exp.workHere && !exp.startDate) ||
        (!exp.workHere && !exp.startDate && !exp.endDate)
      )

    if(incompleteExperiences.length) errors.push('Experiencias incompletas')

    const incompleteEducations = (profile.education || [])
      .filter((edu) =>
        !edu.institutionName ||
        !edu.degree ||
        !edu.condition ||
        !edu.career ||
        (edu.studyingHere && !edu.startDate) ||
        (!edu.studyingHere && !edu.startDate && !edu.endDate)
      )

    if(incompleteEducations.length) errors.push('Estudios incompletos')

    /* en el frontend ya no hay especializaciones */
    // const incompleteEspecializations = (profile.especialization || [])
    //   .filter((esp) =>
    //     !esp.especializationName ||
    //     !esp.especializationtype ||
    //     !esp.especializationPlace ||
    //     (esp.studyingHere && !esp.startDate) ||
    //     (!esp.studyingHere && !esp.startDate && !esp.endDate)
    //   )

    // if(incompleteEspecializations.length) errors.push('Especializaciones incompletos')
  } catch (err) {
    errors.push(err.message)
  } finally {
    return {
      errors,
      profile: profile
    }
  }
}

const sendProfile = async ({ jobId }: MutationSendProfileArgs, context: IContext): Promise<Profile> => {
  try {
    const { errors, profile } = await checkProfile(context)

    if(errors.length) throw new Error(JSON.stringify(errors))

    if(!profile) throw new Error(`Profile userId: ${context.userId} NotFound`)

    const candidateInput: any = {
      birthDate : profile.birthDate,
      civilState: profile.civilState,
      curriculum: {
        fileName : profile.curriculum?.fileName,
        updatedAt: profile.curriculum?.updatedAt,
        url      : profile.curriculum?.url
      },
      docNumber: profile.docNumber,
      education: profile.education.map((edu) => ({
        academicArea   : edu.academicArea,
        career         : edu.career,
        condition      : edu.condition,
        degree         : edu.degree,
        description    : edu.description,
        endDate        : edu.endDate,
        imgUrl         : edu.imgUrl,
        institutionName: edu.institutionName,
        startDate      : edu.startDate,
        studyingHere   : edu.studyingHere
      })),
      emails: profile.emails.map((email) => ({
        type : email.type,
        value: email.value
      })),
      especialization: profile.especialization.map((esp) => ({
        description         : esp.description,
        endDate             : esp.endDate,
        especializationName : esp.especializationName,
        especializationPlace: esp.especializationPlace,
        especializationtype : esp.especializationtype,
        imgUrl              : esp.imgUrl,
        startDate           : esp.startDate,
        studyingHere        : esp.studyingHere
      })),
      experience: profile.experience.map((exp) => ({
        area       : exp.area,
        companyName: exp.companyName,
        description: exp.description,
        endDate    : exp.endDate,
        hierarchy  : exp.hierarchy,
        imgUrl     : exp.imgUrl,
        jobPosition: exp.jobPosition,
        location   : exp.location,
        startDate  : exp.startDate,
        workHere   : exp.workHere
      })),
      firstJob : profile.firstJob,
      firstName: profile.firstName,
      knowledge: profile.knowledge.map((know) => ({
        knowledgeName: know.knowledgeName,
        level        : know.level
      })),
      lastName   : profile.lastName,
      location   : profile.location,
      nationality: profile.nationality,
      phones     : profile.phones.map((phone) => ({
        type : phone.type,
        value: phone.value
      })),
      photo            : profile.photo,
      salaryExpectation: {
        amount  : profile.salaryExpectation?.amount ?? 0,
        currency: profile.salaryExpectation?.currency || 'S/'
      },
      socialNetworks: profile.socialNetworks.map((socialNetwork) => ({
        socialNetwork: socialNetwork.socialNetwork,
        url          : socialNetwork.url
      })),
      websites: profile.websites.map((website) => ({
        type : website.type,
        value: website.value
      })),
      gender : profile.sex,
      docType: profile.docType
    }

    await context.dataSources.gatsAPI.sendProfile({ jobId, userInfo: candidateInput })

    return profile
  } catch (error) {
    throw error
  }
}

export default {
  updateCV,
  getProfileExhaustive,
  updateProfileBasicInformation,
  getAreas,
  sendProfile
}
