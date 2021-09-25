
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');
const path = require('path');

const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')
const { loadSchemaSync } = require('@graphql-tools/load')
const { addResolversToSchema } = require('@graphql-tools/schema')

const resolvers = require('./src/gql/resolvers')


require('dotenv').config({
  // path: path.resolve(process.cwd(), '.env')
})

const PORT = process.env.PORT || 4000;

const connectToDB = require("./src/db/connect")


async function startApolloServer({ expressApp, schema, initContext }) {

  const sql = await connectToDB()
  const httpServer = http.createServer(expressApp)
  const server = new ApolloServer({
    schema,
    // context: initContext,
    context: ({ req }) => ({
      sql
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({ app: expressApp })
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve))
  console.log(`🚀 UI ready at http://localhost:${PORT}`)
  console.log(`🚀 API running at http://localhost:${PORT}${server.graphqlPath}`)
  // console.log(`🚀 Server ready at http://${require('os').hostname()}:${PORT}${server.graphqlPath}`)

  return server
}



async function initContext({ req }) {
  const sql = await connectToDB()
  return {
    sql,
  }
}

(async () => {

  // GraphQL Server
  const schemaOnly = loadSchemaSync("./src/gql/schema/*.graphql",
    { loaders: [new GraphQLFileLoader()] })
  const schema = addResolversToSchema({ schema: schemaOnly, resolvers, });

  const expressApp = express();
  const apolloServer = await startApolloServer({ expressApp, schema, initContext });

  // serve UI
  expressApp.use(express.static(path.join(__dirname, '../', 'ui', 'build')));

})()