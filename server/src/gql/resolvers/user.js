const UserModel = require('../../db/models/User');

module.exports = {

  init: async () => {
    //create default admin user settings
    const data = {
      id: "0",
      displayName: "Admin",
      settings: "{displayLang='SAN', meaningLang='TEL'}",
    };
    await UserModel.create(data);
  },

  me: async () => {
    //TODO: find current user details
    const data = await UserModel.findOne({ displayName: "Admin" })
    return data;
  }
}