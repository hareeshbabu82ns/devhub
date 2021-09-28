const { ApolloServer } = require('apollo-server-express');
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader')
const { loadSchemaSync } = require('@graphql-tools/load')
const { addResolversToSchema } = require('@graphql-tools/schema')

const connectToDB = require("../db/connect");
const path = require('path');

async function buildApolloServer({ schema, plugins, dbConfig, envFilePath, envFile, contextValues = {}, debug } = {}) {

  var useDBConfig = dbConfig
  if (!dbConfig) {
    require('dotenv').config({
      path: envFilePath || path.resolve(process.cwd(), './', envFile || '.env.local')
    })
    useDBConfig = {
      mdbHost: process.env['MONGO_DB_HOST'] || 'localhost',
      mdbPort: process.env['MONGO_DB_PORT'] || '21017',
      mdbDB: process.env['MONGO_DB_DB'] || 'test',
      mdbUser: process.env['MONGO_DB_USER'] || 'test',
      mdbPassword: process.env['MONGO_DB_PASSWORD'] || '',
    }
    // console.log(useDBConfig)
  }

  var useSchema = schema
  if (!schema) {
    const schemaOnly = loadSchemaSync(path.join(__dirname, "./schema/*.graphql"),
      { loaders: [new GraphQLFileLoader()] })
    const resolvers = require('./resolvers')
    useSchema = addResolversToSchema({ schema: schemaOnly, resolvers, });
  }

  const dbConnection = await connectToDB({ ...useDBConfig, debug })
  const server = new ApolloServer({
    schema: useSchema,
    // context: initContext,
    context: ({ req }) => ({
      dbConnection,
      ...contextValues,
    }),
    plugins,
  })

  return server
}

module.exports = buildApolloServer