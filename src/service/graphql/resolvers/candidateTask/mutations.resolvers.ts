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
  notifyOpenTaskInDesktop: async (_, args, context) =>
    CandidateTaskActuator.notifyOpenTaskInDesktop(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  updateBasicCandidateTask: async (_, args, context) =>
    CandidateTaskActuator.updateBasicCandidateTask(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  executed: async (_, args, context) =>
    CandidateTaskActuator.executed(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}

