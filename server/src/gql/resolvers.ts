import { Resolvers } from './schema';
import Entity from '../db/EntityModel';

export const resolvers: Resolvers = {
  Query: {
    version: (parent, args) => {
      return "v1";
    }
  },
  Mutation: {
    createEntity: async (parent, args) => {
      const res = await Entity.find();
      console.log('entities found:', res)
      return "test"
    }
  }
};