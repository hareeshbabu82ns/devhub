import { Resolvers } from './schema';

export const resolvers: Resolvers = {
  Query: {
    version: (parent, args) => {
      return "v1";
    }
  },
  Mutation: {
    createEntity: (parent, args) => {
      return "test"
    }
  }
};