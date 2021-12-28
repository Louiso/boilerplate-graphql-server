import { IContext } from 'interfaces/general'
import ProfileModel from '../../models/mongo/profile'
import CareerModel from '../../models/mongo/career'
import {
  Profile,
  Career,
  GroupOnetSuggestion,
  OnetSuggestion,
  FindOnetSuggestion,
  QueryGetGroupOnetSuggestionsArgs,
  MutationUpdateProfileCareerArgs,
  DateOnetExpired
} from 'interfaces/graphql'
import { groupBy } from 'utils/groupBy'
import { careerClusterIcons, careerClusterIconsSVG } from './icons'
import { monthDiff } from 'utils/dateDiff'

const getGroupOnetSuggestions = async (
  args: QueryGetGroupOnetSuggestionsArgs,
  { dataSources: { onetAPI } }: IContext
): Promise<Array<GroupOnetSuggestion>> => {
  try {
    const { information, success } = await onetAPI.groupOnetSuggestions(args)
    if(!success) return []

    if(!information.length)
      return []

    const groupDataByKey = groupBy(information, 'cluster')

    if(!Object.keys(groupDataByKey).length)
      return []

    const groupOnetToResolve: GroupOnetSuggestion[] = []
    for (const dt in groupDataByKey) {
      const dataToPush = {
        iconCluster     : careerClusterIcons[dt] || 'https://cdn.krowdy.com/plantillas/icons/default.png',
        iconClusterSVG  : careerClusterIconsSVG[dt] || 'https://cdn.krowdy.com/plantillas/icons/default.svg',
        principalCluster: (dt === undefined || dt === 'undefined') ? 'Otros' : dt
      }

      groupOnetToResolve.push(dataToPush)
    }

    return groupOnetToResolve
  } catch (error) {
    throw error
  }
}

const getJobOnetSuggestions = async (
  args: QueryGetGroupOnetSuggestionsArgs,
  { dataSources: { onetAPI } }: IContext
): Promise<Array<FindOnetSuggestion>> => {
  try {
    const { information, success } = await onetAPI.jobOnetSuggestions(args)

    if(!success) return []

    if(!information.length)
      return []

    const groupDataByKey = groupBy(information, 'cluster')

    if(!Object.keys(groupDataByKey).length)
      return []

    const groupOnetToResolve: FindOnetSuggestion[] = []
    for (const dt in groupDataByKey) {
      const internalData = groupDataByKey[dt] as OnetSuggestion[]

      const suggestedPositions: OnetSuggestion[] = []

      for (const internalElement of internalData)
        suggestedPositions.push({
          name        : internalElement?.name,
          url         : internalElement?.url,
          cluster     : internalElement?.cluster || 'Otros',
          code        : internalElement?.code,
          codeCluster : internalElement?.codeCluster  || '__OTHER__',
          codePathway : internalElement?.codePathway,
          description : internalElement?.description,
          pathWay     : internalElement?.pathWay,
          requirements: internalElement?.requirements || 'Sin información',
          synonyms    : internalElement?.synonyms || []
        })

      const dataToPush = {
        key: {
          iconCluster     : careerClusterIcons[dt] || 'https://cdn.krowdy.com/plantillas/icons/default.png',
          iconClusterSVG  : careerClusterIconsSVG[dt] || 'https://cdn.krowdy.com/plantillas/icons/default.svg',
          principalCluster: (dt === undefined || dt === 'undefined') ? 'Otros' : dt
        },
        data: suggestedPositions
      }

      groupOnetToResolve.push(dataToPush)
    }

    return groupOnetToResolve
  } catch (error) {
    throw error
  }
}

const updateProfileCareer = async ({ input }: MutationUpdateProfileCareerArgs, context: IContext): Promise<Profile> => {
  try {
    const columns = { _id: 1, career: 1, userId: 1 }

    const profile = await ProfileModel
      .findOne({ idUser: context.userId! })
      .select(columns)
      .lean()

    if(!profile) throw new Error(`Profile userId ${context.userId} NotFound`)

    const { career } = profile

    const careerUpdate: Career = {
      ...career as Career,
      code       : input.code,
      name       : input.name,
      cluster    : input.cluster,
      iconCluster: input.iconCluster,
      description: input.description,
      search     : input.search,
      view       : input.view,
      updatedAt  : Date.now()
    }

    const update: { career: Career; } = { career: careerUpdate }

    const careerSave = new CareerModel({
      profileId  : profile._id,
      code       : input.code,
      name       : input.name,
      cluster    : input.cluster,
      iconCluster: input.iconCluster,
      description: input.description,
      search     : input.search,
      view       : input.view
    })

    careerSave.save()

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

const getProfileDateOnetExpired = async (context: IContext): Promise<DateOnetExpired> => {
  try {
    const columns = { _id: 1, firstName: 1, lastName: 1, career: 1, userId: 1 }

    const profile = await ProfileModel
      .findOne({ idUser: context.userId! })
      .select(columns)
      .lean()

    if(!profile) throw new Error(`Profile userId ${context.userId} NotFound`)

    const { career } = profile

    // Primer trabajo
    if(!career)
      return {
        isMaxSixExp: false,
        isFirstJob : true
      }

    const currentDate = new Date()
    const { updatedAt } = career
    const currentMonth = monthDiff(updatedAt, currentDate)

    return {
      isMaxSixExp: currentMonth > 6,
      isFirstJob : false
    }
  } catch (error) {
    throw error
  }
}

const getCareer = async (context: IContext): Promise<Career> => {
  try {
    const columns = { _id: 1, firstName: 1, lastName: 1, career: 1, userId: 1 }

    const profile = await ProfileModel
      .findOne({ idUser: context.userId! })
      .select(columns)
      .lean()

    if(!profile) throw new Error(`Profile userId ${context.userId} NotFound`)

    const { career } = profile

    // Primer trabajo
    if(!career)
      throw new Error('Not found career.')

    const iconCluster = careerClusterIconsSVG[career.cluster!] || 'https://cdn.krowdy.com/plantillas/icons/default.svg'

    return {
      ...career,
      iconCluster: iconCluster
    }
  } catch (error) {
    throw error
  }
}

export default {
  getGroupOnetSuggestions,
  getJobOnetSuggestions,
  updateProfileCareer,
  getProfileDateOnetExpired,
  getCareer
}
