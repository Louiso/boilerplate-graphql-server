import { IContext } from 'interfaces/general'
import { QueryResolvers } from 'interfaces/graphql'

export const Query: QueryResolvers<IContext> = {
  holaMundo: () => 'Hola Mundo'
}
