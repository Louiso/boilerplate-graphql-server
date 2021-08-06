import CandidateActuator from 'actuators/candidate'
import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'

export const Query: QueryResolvers<IContext> = {
  getCandidate: async (_, args, context) =>
    CandidateActuator.getCandidate(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
