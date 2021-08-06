import { Request, Response, NextFunction } from 'express'
import getDataSources from '../../graphql/dataSources'

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { authorization } = req.headers

    if(!authorization) throw new Error('No tiene accessToken')

    const dataSources = getDataSources(authorization)
    const { userId } = await dataSources.accountAPI.authorization()

    if(!userId) throw new Error('User NotFound')

    res.locals = {
      userId,
      dataSources
    }
    next()
  } catch (error) {
    console.log('error', error)
    res.json({
      error  : { message: error.message },
      success: false
    })
  }
}
