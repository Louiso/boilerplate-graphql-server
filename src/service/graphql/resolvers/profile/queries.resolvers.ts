import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryGetAreasArgs, QueryResolvers } from 'interfaces/graphql'

import ProfileActuator from 'actuators/profile'

export const Query: QueryResolvers<IContext> = {
  getProfileExhaustive: (_, args, context) => ProfileActuator.getProfileExhaustive(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    }),
  getAreas: (_, args: QueryGetAreasArgs, context: IContext) =>
    ProfileActuator.getAreas(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}