const { merge, spread } = require('lodash');
const { json } = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools');
const { God, ResolversGod } = require('./god');
const { Item, ResolversItem } = require('./item');

function setup(app, middlewares) {
  // The GraphQL schema in string form
  const Query = `
  type Query {
    _empty : String
  }
`;

  // The resolvers
  const resolvers = {};

  // Put together a schema
  const schema = makeExecutableSchema({
    typeDefs: [Query, God, Item],
    resolvers: merge(resolvers, ResolversGod, ResolversItem),
  });

  // The GraphQL endpoint
  app.use('/graphql', json(), ...middlewares,
    graphqlExpress(request => ({ schema, context: { request } })));

  // GraphiQL, a visual editor for queries
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

};

module.exports = setup;