import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

import ProfileActuator from 'actuators/profile'

export const Mutation: MutationResolvers<IContext> = {
  updateProfileBasicInformation: (_, args, context) =>
    ProfileActuator.updateProfileBasicInformation(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
