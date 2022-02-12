import { defaultFieldResolver } from 'graphql'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'

// class AuthDirective extends SchemaDirectiveVisitor {
//   args!: { optional: boolean;}
//   visitFieldDefinition(field: GraphQLField<any, any>): GraphQLField<any, any> | void | null {
//     const { optional } = this.args
//     const { resolve = defaultFieldResolver } = field
//     field.resolve = async function (...args) {
//       const [ ,, context ] = args

//       const { authorized } = (context as IContext)

//       if(optional)
//         return resolve.apply(
//           this,
//           args
//         )

//       if(!authorized) throw new Error('Forbidden: Error al autenticar')

//       return resolve.apply(
//         this,
//         args
//       )
//     }
//   }
// }

// This function takes in a schema and adds upper-casing logic
// to every resolver for an object field that has a directive with
// the specified name (we're using `upper`)
function authorizedDirectiveTransformer(schema: any, directiveName: string) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const authorizedDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

      if(authorizedDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig

        //     const { optional } = this.args
        //     const { resolve = defaultFieldResolver } = field
        //     field.resolve = async function (...args) {
        //       const [ ,, context ] = args

        //       const { authorized } = (context as IContext)

        //       if(optional)
        //         return resolve.apply(
        //           this,
        //           args
        //         )

        //       if(!authorized) throw new Error('Forbidden: Error al autenticar')

        //       return resolve.apply(
        //         this,
        //         args
        //       )
        //     }

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (source, args, context, info) {
          const result = await resolve(source, args, context, info)
          console.log('result', result)
          // if(typeof result === 'string')
          //   return result.toUpperCase()

          return result
        }

        return fieldConfig
      }
    }
  })
}

export default {
  authorizedDirectiveTransformer
}
