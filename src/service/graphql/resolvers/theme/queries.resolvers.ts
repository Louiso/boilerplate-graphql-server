import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'

import ThemeActuator from 'actuators/theme'

export const Query: QueryResolvers<IContext> = {
  getTheme: (_, args, context) => ThemeActuator.getTheme(args, context)
    .catch((error) => {
      throw new ApolloError(error)
    })
}
