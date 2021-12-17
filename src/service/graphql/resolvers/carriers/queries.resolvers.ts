import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryGetGroupOnetSuggestionsArgs, QueryResolvers } from 'interfaces/graphql'

import CarrierActuator from 'actuators/carriers'

export const Query: QueryResolvers<IContext> = {
  getGroupOnetSuggestions: (_, args: QueryGetGroupOnetSuggestionsArgs, context) => CarrierActuator.getGroupOnetSuggestions(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    }),
  getJobOnetSuggestions: (_, args: QueryGetGroupOnetSuggestionsArgs, context) => CarrierActuator.getJobOnetSuggestions(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
