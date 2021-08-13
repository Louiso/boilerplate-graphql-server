import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'

import ProfileActuator from 'actuators/profile'

export const Query: QueryResolvers<IContext> = {
  uploadCV: (_, args, context) => ProfileActuator.uploadCV(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    }),
  getAreas: (_, args, context) => ProfileActuator.getAreas(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
