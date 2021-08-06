import signale from 'signale'

import { ApolloServer } from 'apollo-server-express'
import express from 'apollo-server-express/node_modules/@types/express'

import schema from './service/graphql/schema'
// import { datasources } from './graphql/extentions/datasources'

import app from './service/api/app'

import './config/connections'
import context from './service/graphql/context'

const { PORT } = process.env

signale.star('[SERVICE] GRAPHQL SERVICE INIT PROCESS')

const server = new ApolloServer({
  context,
  schema,
  introspection: true
})

const main = async function() {
  await server.start()

  server.applyMiddleware({
    app: app as express.Application
  })

  app.listen(PORT, () => {
    signale.success(`[Krowdy] Server ready at http://localhost:${PORT}/graphql`)
    signale.info(`[KROWDY] SERVER RUN WITH ${process.env.NODE_OPTIONS}`)
    signale.info(`Try your health check at: http://localhost:${PORT}/graphql.well-known/apollo/server-health`)
  })
}

main()

