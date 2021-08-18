import { ApolloError } from 'apollo-server'
import { IContext } from 'interfaces/general'
import { MutationResolvers } from 'interfaces/graphql'

import ProfileActuator from 'actuators/profile'

export const Mutation: MutationResolvers<IContext> = {
  updateProfileBasicInformation: (_, args, context) =>
    ProfileActuator.updateProfileBasicInformation(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  updateCV: (_, args, context) =>
    ProfileActuator.updateCV(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  sendProfile: (_, args, context) =>
    ProfileActuator.sendProfile(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  updateExperience: (_, args, context) =>
    ProfileActuator.updateExperience(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      }),
  updateReferents: (_, args, context) =>
    ProfileActuator.updateReferents(args, context)
      .catch((error) => {
        throw new ApolloError(error)
      })
}
