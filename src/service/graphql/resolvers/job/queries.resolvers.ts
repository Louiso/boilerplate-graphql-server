import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'

import JobActuator from 'actuators/job'

export const Query: QueryResolvers<IContext> = {
  getJob: (_, args, context) => JobActuator.getJob(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
