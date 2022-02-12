import { ApolloError } from 'apollo-server'

import getDataSources from './dataSources'

async function Context({ req }: any) {
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
  } catch (error: any) {
    console.log('if -> error', error.message)
    if(error.name === 'SyntaxError') throw new ApolloError(error.message)
    throw new ApolloError(`Service generate this error: [${error.message}]`)
  }
}

export default Context
