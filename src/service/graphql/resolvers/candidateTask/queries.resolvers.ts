import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'
import CandidateTaskActuator from 'actuators/candidateTask'

export const Query: QueryResolvers<IContext> = {
  getCandidateTask: async (_, args, context) =>
    CandidateTaskActuator.getCandidateTask(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  getAppSections: async (_, args, context) =>
    CandidateTaskActuator.getAppSections(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
