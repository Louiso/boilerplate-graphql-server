import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'

import LaborExchangeActuator from 'actuators/laborExchange'

export const Query: QueryResolvers<IContext> = {
  getLaborExchangeTemplate: (_, args, context) =>
    LaborExchangeActuator.getLaborExchangeTemplate(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
