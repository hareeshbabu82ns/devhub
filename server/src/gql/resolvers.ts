import { Resolvers, User } from './schema';
import Entity from '../db/models/Entity';
import UserModel from '../db/models/User';

export const resolvers: Resolvers = {
  Query: {

    version: (parent, args) => {
      return "v1";
    },

    me: async (parent, args) => {

      //TODO: find current user details
      const data = await UserModel.findOne({ displayName: "Admin" })
      return data as User;
    }
  },

  Mutation: {

    // initialization logic
    init: async (parent, args) => {

      //create default admin user settings
      const data: User = {
        id: "0",
        displayName: "Admin",
        settings: "{displayLang='SAN'}",
      };
      await UserModel.create(data);

      return "data successfully initialized";
    },

    // create Entity
    createEntity: async (parent, args) => {
      const res = await Entity.find();
      console.log('entities found:', res)
      return "test"
    }
  },
};