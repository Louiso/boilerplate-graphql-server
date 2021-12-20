import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

import CareerActuator from 'actuators/career'

export const Mutation: MutationResolvers<IContext> = {
  updateProfileCareer: (_, args, context) => CareerActuator.updateProfileCareer(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
