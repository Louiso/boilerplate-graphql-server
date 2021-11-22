import { ApolloError } from 'apollo-server-errors'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'
import TaskActuator from 'actuators/task'

export const Mutation: MutationResolvers<IContext> = {
  updateTaskDate: (_, args, context: IContext) =>
    TaskActuator.updateTaskDate(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  resetTask: (_, args, context: IContext) =>
    TaskActuator.resetTask(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
