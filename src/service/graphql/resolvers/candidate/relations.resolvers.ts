import { IContext } from 'interfaces/general'
import { CandidateResolvers } from 'interfaces/graphql'
import CandidateTaskActuator from 'actuators/candidateTask'
import { ApolloError } from 'apollo-server'

export const Candidate: CandidateResolvers<IContext> = {
  candidateTasks: async (candidate, _, context) =>
    CandidateTaskActuator.getCandidateTasksByCandidate(candidate, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}

