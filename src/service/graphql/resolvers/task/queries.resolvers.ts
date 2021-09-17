import { ApolloError } from 'apollo-server-errors'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'
import TaskActuator from 'actuators/task'

export const Query: QueryResolvers<IContext> = {
  getTaskById: (_, args, context: IContext) =>
    TaskActuator.getTaskById(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
