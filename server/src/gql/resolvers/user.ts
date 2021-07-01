import { Resolvers, User } from '../schema';
import UserModel from '../../db/models/User';

export default {

  init: async () => {
    //create default admin user settings
    const data: User = {
      id: "0",
      displayName: "Admin",
      settings: "{displayLang='SAN', meaningLang='TEL'}",
    };
    await UserModel.create(data);
  },

  me: async () => {
    //TODO: find current user details
    const data = await UserModel.findOne({ displayName: "Admin" })
    return data as User;
  }
}