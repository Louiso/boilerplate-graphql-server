import { SchemaDirectiveVisitor } from '@graphql-tools/utils'
import { defaultFieldResolver, /* GraphQLObjectType, */ GraphQLField } from 'graphql'
import { IContext } from 'interfaces/general'

class AuthDirective extends SchemaDirectiveVisitor {
  args!: { optional: boolean;};
  visitFieldDefinition(field: GraphQLField<any, any>): GraphQLField<any, any> | void | null {
    const { optional } = this.args
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args) {
      const [ ,, context ] = args

      const { authorized } = (context as IContext)

      if(optional)
        return resolve.apply(
          this,
          args
        )

      if(!authorized) throw new Error('Forbidden: Error al autenticar')

      return resolve.apply(
        this,
        args
      )
    }
  }
}

export default { AuthDirective }
