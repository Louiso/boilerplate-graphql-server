import { IContext } from 'interfaces/general'
import { CandidateTaskResolvers } from 'interfaces/graphql'
import TaskActuator from 'actuators/task'
import { ApolloError } from 'apollo-server'

export const CandidateTask: CandidateTaskResolvers<IContext> = {
  task: async (candidateTask, _, context) =>
    TaskActuator.getTaskById({ taskId: candidateTask.taskId }, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}

