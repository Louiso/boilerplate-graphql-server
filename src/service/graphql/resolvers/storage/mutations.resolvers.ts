import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

import StorageActuator from 'actuators/storage'

export const Mutation: MutationResolvers<IContext> = {
  getStorageToken: (_, args, context) => StorageActuator.getStorageToken(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
