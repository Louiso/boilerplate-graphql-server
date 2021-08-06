import { Response, User } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'

const getUser = async ({ dataSources: { accountAPI }, userId }: IContext): Promise<User> => {
  try {
    const { success, user } = await accountAPI.getUser(String(userId))

    if(!success) throw new Error(`User ${userId} NotFound`)

    return {
      _id      : user._id,
      email    : user.email,
      firstName: user.firstName,
      lastName : user.lastName,
      phone    : user.phone,
      photo    : user.photo
    }
  } catch (error) {
    throw error
  }
}

const logout = async ({ dataSources: { accountAPI }, authorization, refreshToken }: IContext): Promise<Response> => {
  try {
    const { success, data } = await accountAPI.logout(String(authorization), String(refreshToken))

    return {
      success,
      data
    }
  } catch (error) {
    throw error
  }
}

export default {
  getUser,
  logout
}
