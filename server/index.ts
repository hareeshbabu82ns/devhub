import express, { Express } from 'express'
import cors from 'cors'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './src/gql/resolvers'
import { importSchema } from 'graphql-import'

import { connectDB } from './src/db/connect'

const typeDefs = importSchema('./src/gql/schema.graphql')

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers
  })
});

const app = express();

// serve UI
app.use(express.static(path.join(__dirname, '../', 'ui', 'build')));

// setup CORS for local development
const allowedOrigins = ['http://localhost:3000'];
const options: cors.CorsOptions = {
  origin: allowedOrigins
};
app.use(cors(options))

// Additional middleware can be mounted at this point to run before Apollo.
// app.use('*');

// Mount Apollo middleware here.
server.applyMiddleware({ app, path: '/graphql' });

run(app, server).then(() => {
  // run this logic at last
  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
})

//any async initialization logic goes here
async function run(app: Express, apollo: ApolloServer): Promise<void> {
  const db = await connectDB();
  console.log('Connected to MongoDB...')
}