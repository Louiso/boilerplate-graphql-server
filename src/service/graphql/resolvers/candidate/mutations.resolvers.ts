import CandidateActuator from 'actuators/candidate'
import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

export const Mutation: MutationResolvers<IContext> = {
  leavePostulation: async (_, args, context) =>
    CandidateActuator.leavePostulation(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}