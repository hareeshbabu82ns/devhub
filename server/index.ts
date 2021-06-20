import express from 'express'
import cors from 'cors'
import path from 'path'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './src/gql/resolvers'
import { importSchema } from 'graphql-import'

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

app.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
