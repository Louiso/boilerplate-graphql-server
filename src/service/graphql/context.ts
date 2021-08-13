import { ExpressContext } from 'apollo-server-express'
import { ApolloError } from 'apollo-server'

import getDataSources from './dataSources'

// https://www.apollographql.com/docs/apollo-server/security/authentication/#putting-user-info-on-the-context
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
async function Context({ req }: ExpressContext) {
  try {
    const { headers: { authorization, refreshtoken } } = req

    const dataSources = getDataSources(authorization as string)

    const { success, userId } = await dataSources.accountAPI.authorization()
      .catch(() => ({ userId: null, success: false }))

    return {
      authorization,
      refreshToken: refreshtoken,
      dataSources,
      authorized  : success,
      userId
    }
  } catch (error) {
    console.log('if -> error', error.message)
    if(error.name === 'SyntaxError') throw new ApolloError(error.message)
    throw new ApolloError(`Service generate this error: [${error.message}]`)
  }
}

export default Context
