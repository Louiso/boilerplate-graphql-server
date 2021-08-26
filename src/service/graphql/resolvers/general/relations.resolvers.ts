import { GraphQLScalarType } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { Kind } from 'graphql/language'
import { IContext } from 'interfaces/general'
import { Resolvers } from 'interfaces/graphql'

const resolvers: Resolvers<IContext> = {
  Date: new GraphQLScalarType({
    description: 'Date custom scalar type',
    name       : 'Date',
    parseLiteral(ast) {
      if(ast.kind === Kind.INT)
        return parseInt(ast.value, 10) // ast value is always in string format

      return null
    },
    parseValue(value) {
      return new Date(value) // value from the client
    },
    serialize(value) {
      return new Date(value).getTime() // value sent to the client
    }
  }),
  JSON: GraphQLJSON
}

export default resolvers
