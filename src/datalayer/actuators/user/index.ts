import { Response, User } from 'interfaces/graphql'
import { IContext } from 'interfaces/general'
import UserModel from 'models/mongo/user'
import bcrypt from 'bcrypt'
import { Types } from 'mongoose'
export const saltRounds = 10

interface RegisterProps {
  firstName: string;
  lastName : string;
  email    : string;
  password : string;
}

const register = async (props: RegisterProps) => {
  try {
    if(await UserModel.exists({ email: props.email })) throw Error('Email already exists')

    const hash = await bcrypt.hash(props.password, saltRounds)

    const user = await UserModel.create({
      firstName: props.firstName,
      lastName : props.lastName,
      email    : props.email,
      password : hash
    })

    return user
  } catch (error) {
    throw error
  }
}

interface GetBasicUserInformation {
  _id?: string | Types.ObjectId;
  email?: string;
}

const getBasicUserInformation = (args: GetBasicUserInformation) => UserModel
  .findOne(args)
  .select({
    _id      : 1,
    email    : 1,
    firstName: 1,
    lastName : 1,
    photo    : 1
  })
  .lean()

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

const UserActuator = {
  getUser,
  logout,
  register,
  getBasicUserInformation
}

export default UserActuator
