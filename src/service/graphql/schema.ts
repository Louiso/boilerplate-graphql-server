import path from 'path'
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import Directives from './resolvers/general/directives'

const resolversArray = loadFilesSync(path.join(__dirname, './**/*.resolvers.*'))
const typeDefsArray = loadFilesSync(path.join(__dirname, './**/*.graphql'))

const resolvers =  mergeResolvers(resolversArray)
const typeDefs =  mergeTypeDefs(typeDefsArray)

const schemaDirectives: any = {
  auth: Directives.AuthDirective
}

export default makeExecutableSchema({
  resolvers,
  typeDefs: [ DIRECTIVES, typeDefs ],
  schemaDirectives
})
