import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'
import CandidateTaskActuator from 'actuators/candidateTask'

export const Mutation: MutationResolvers<IContext> = {
  createResultTask: async (_, args, context) =>
    CandidateTaskActuator.createResultTask(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  nofifyOpenTaskInDesktop: async (_, args, context) =>
    CandidateTaskActuator.nofifyOpenTaskInDesktop(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
