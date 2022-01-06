import CandidateActuator from 'actuators/candidate'
import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

export const Mutation: MutationResolvers<IContext> = {
  leavePostulation: async (_, args, context) =>
    CandidateActuator.leavePostulation(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  addMergeTokenToCandidate: async (_, args, context) =>
    CandidateActuator.addMergeTokenToCandidate(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  addUserOnMergeCandidate: async (_, args, context) =>
    CandidateActuator.addUserOnMergeCandidate(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  sendPostulationReminderMail: async (_: any, args: { candidateId: string; }, context: IContext) =>
    CandidateActuator.sendPostulationReminderMail(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
