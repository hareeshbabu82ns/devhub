const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const express = require('express');
const http = require('http');
const path = require('path');

require('dotenv').config({
  path: path.resolve(process.cwd(), '.env.local')
})

const PORT = process.env.PORT || 4000;

const connectToDB = require("./src/db/connect")
const buildApolloServer = require("./src/gql/apollo_server")

const dbConfig = {
  mdbHost: process.env['MONGO_DB_HOST'] || 'localhost',
  mdbPort: process.env['MONGO_DB_PORT'] || '21017',
  mdbDB: process.env['MONGO_DB_DB'] || 'test',
  mdbUser: process.env['MONGO_DB_USER'] || 'test',
  mdbPassword: process.env['MONGO_DB_PASSWORD'] || '',
}

async function startApolloServer({ expressApp, schema, initContext }) {

  const httpServer = http.createServer(expressApp)
  const server = await buildApolloServer({
    schema,
    dbConfig,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    debug: false,
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
  const dbConnection = await connectToDB({ ...dbConfig })
  return {
    dbConnection,
  }
}

(async () => {

  // GraphQL Server

  const expressApp = express();
  const apolloServer = await startApolloServer({ expressApp, initContext });

  // serve UI
  expressApp.use(express.static(path.join(__dirname, '../', 'ui', 'build')));

})()