import { IContext } from 'interfaces/general'
import ProfileModel from '../../models/mongo/profile'
import CarrierModel from '../../models/mongo/carriers'
import {
  Profile,
  Carriers,
  GroupOnetSuggestion,
  OnetSuggestion,
  FindOnetSuggestion,
  QueryGetGroupOnetSuggestionsArgs,
  MutationUpdateProfileCarrierArgs
} from 'interfaces/graphql'
import { groupBy } from 'utils/groupBy'
import { careerClusterIcons, careerClusterIconsSVG } from './icons'

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
          cluster     : internalElement?.cluster,
          code        : internalElement?.code,
          codeCluster : internalElement?.codeCluster,
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

const updateProfileCarrier = async ({ input }: MutationUpdateProfileCarrierArgs, context: IContext): Promise<Profile> => {
  try {
    const columns = { _id: 1, carriers: 1, userId: 1 }

    const profile = await ProfileModel
      .findOne({ idUser: context.userId! })
      .select(columns)
      .lean()

    if(!profile) throw new Error(`Profile userId ${context.userId} NotFound`)

    const { carriers } = profile

    const carriersUpdate: Carriers = {
      ...carriers as Carriers,
      code     : input.code,
      name     : input.name,
      search   : input.search,
      view     : input.view,
      updatedAt: Date.now()
    }

    const update: { carriers: Carriers; } = { carriers: carriersUpdate }

    const carriersSave = new CarrierModel({
      profileId: profile._id,
      code     : input.code,
      name     : input.name,
      search   : input.search,
      view     : input.view
    })

    carriersSave.save()

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

export default {
  getGroupOnetSuggestions,
  getJobOnetSuggestions,
  updateProfileCarrier
}
