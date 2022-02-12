import { defaultFieldResolver } from 'graphql'
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'

function authorizedDirectiveTransformer(schema: any, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const authorizedDirective = getDirective(schema, fieldConfig, directiveName)?.[0]

      if(authorizedDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig

        fieldConfig.resolve = async function (source, args, context, info) {
          const { optional } = authorizedDirective

          if(optional)
            return resolve(source, args, context, info)

          if(!context.authorized) throw new Error('Forbidden: Error al autenticar')

          return resolve(source, args, context, info)
        }

        return fieldConfig
      }
    }
  })
}

export default {
  authorizedDirectiveTransformer
}
