import AuthActuator from 'actuators/user'
import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'

export const Query: QueryResolvers<IContext> = {
  authorization: async (_, __, { dataSources: { accountAPI } }) =>
    accountAPI.authorization()
      .catch((error) => {
        throw new ApolloError(error)
      }),
  getUser: (_, __, context) => AuthActuator.getUser(context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
