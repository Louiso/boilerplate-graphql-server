import { ExpressContext } from 'apollo-server-express/dist/ApolloServer'
import { ApolloError } from 'apollo-server-errors'

import getDataSources from './dataSources'

const PUBLIC_OPERATION_NAMES = [
  'authorization',
  'IntrospectionQuery'
]

// https://www.apollographql.com/docs/apollo-server/security/authentication/#putting-user-info-on-the-context
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function Context({ req }: ExpressContext) {
  try {
    const { body } = req

    const { headers: { authorization, refreshtoken } } = req

    const dataSources = getDataSources(authorization as string)

    const operationNames = Array.isArray(body) ? body.map(({ operationName }) => operationName) : [ body.operationName ]

    const context = {
      authorization,
      refreshToken: refreshtoken,
      dataSources
    }

    if(!Array.isArray(body) && body.query.includes('__schema'))
      return {
        ...context,
        userId: ''
      }

    if(operationNames.every((operationName) => PUBLIC_OPERATION_NAMES.includes(operationName)))
      return {
        ...context,
        userId: ''
      }

    const { success, userId } = await dataSources.accountAPI.authorization()

    if(!success) throw new Error('Error al autenticar')

    return {
      ...context,
      userId
    }
  } catch (error) {
    console.log('if -> error', error)
    if(error.name === 'SyntaxError') throw new ApolloError(error.message)
    throw new ApolloError(`Service generate this error: [${error.message}]`)
  }
}

export default Context
