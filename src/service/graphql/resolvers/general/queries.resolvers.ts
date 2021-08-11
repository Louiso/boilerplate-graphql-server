import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'
import GeneralActuator from 'actuators/general'

export const Query: QueryResolvers<IContext> = {
  holaMundo     : () => 'Hola Mundo',
  getCountryCode: (_, args) =>
    GeneralActuator.getCountryCode(args)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
