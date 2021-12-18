import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

import CarriersActuator from 'actuators/carriers'

export const Mutation: MutationResolvers<IContext> = {
  updateProfileCarrier: (_, args, context) =>
    CarriersActuator.updateProfileCarrier(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
