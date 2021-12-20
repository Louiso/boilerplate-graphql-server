import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryGetGroupOnetSuggestionsArgs, QueryResolvers } from 'interfaces/graphql'

import CareerActuator from 'actuators/career'

export const Query: QueryResolvers<IContext> = {
  getGroupOnetSuggestions: (_, args: QueryGetGroupOnetSuggestionsArgs, context) => CareerActuator.getGroupOnetSuggestions(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    }),
  getJobOnetSuggestions: (_, args: QueryGetGroupOnetSuggestionsArgs, context) => CareerActuator.getJobOnetSuggestions(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    }),
  getProfileDateOnetExpired: (_, __, context: IContext) => CareerActuator.getProfileDateOnetExpired(context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
