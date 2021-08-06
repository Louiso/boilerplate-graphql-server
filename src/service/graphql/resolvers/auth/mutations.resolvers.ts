import AuthActuator from 'actuators/user'
import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

export const Mutation: MutationResolvers<IContext> = {
  logout: async (_, __, context) =>
    AuthActuator.logout(context)
      .catch((error) => {
        console.log('error', error)
        throw new ApolloError(error)
      })
}
