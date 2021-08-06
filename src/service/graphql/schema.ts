import path from 'path'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'

const resolversArray = loadFilesSync(path.join(__dirname, './**/*.resolvers.*'))
const typeDefsArray = loadFilesSync(path.join(__dirname, './**/*.graphql'))

const resolvers =  mergeResolvers(resolversArray)
const typeDefs =  mergeTypeDefs(typeDefsArray)

export default makeExecutableSchema({
  resolvers,
  typeDefs: [ DIRECTIVES, typeDefs ]
})
