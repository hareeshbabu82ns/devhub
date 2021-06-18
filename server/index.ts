import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './gql/resolvers'
import { importSchema } from 'graphql-import'

const typeDefs = importSchema('./gql/schema.graphql')

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers
  })
});

const app = express();

// Additional middleware can be mounted at this point to run before Apollo.
// app.use('*');

// Mount Apollo middleware here.
server.applyMiddleware({ app, path: '/graphql' });

app.listen(4000, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});
