const UserModel = require('../../db/models/User');
const initData = require('./init_data.json')
const { buildQueryFilter } = require('./utils');

// module.exports = {

//   init: async () => {
//     //create default admin user settings
//     const data = {
//       id: "0",
//       displayName: "Admin",
//       settings: "{displayLang='SAN', meaningLang='TEL'}",
//     };
//     await UserModel.create(data);
//   },

//   me: async () => {
//     //TODO: find current user details
//     const data = await UserModel.findOne({ displayName: "Admin" })
//     return data;
//   }
// }

module.exports = {

  init: async () => {
    // create default users
    const asyncList = initData.users.map(({ displayName, settings }) =>
      UserModel.create({ displayName, settings }))
    await Promise.all(asyncList)
  },

  read: async (args, requestedFields) => {
    const query = UserModel.find();

    if (args.by) {
      buildQueryFilter(query, args.by);
    }
    query.limit(args.limit);

    query.select(requestedFields.join(' '));
    const res = await query.exec();
    return res.map(mapModelToGQL);
  },
  update: async (id, data) => {
    const item = await UserModel.findOneAndUpdate({ "_id": id }, { $set: { ...data } });
    // console.log(item)
    return item.id;
  },
  create: async (data) => {
    const item = await UserModel.create(data);
    // console.log(item)
    return item.id;
  },
  delete: async (id) => {
    const item = await UserModel.deleteOne({ "_id": id });
    // console.log(item)
    if (item.deletedCount === 1)
      return id;
    else
      throw `Nothing deleted with matching id: ${id}`;
  },
  me: async () => {
    //TODO: find current user details
    const res = await UserModel.findOne({ displayName: "Admin" })
    return mapModelToGQL(res);
  }
}

const mapModelToGQL = (item) => {
  // console.log(item)
  const type = {
    id: item.id,
    displayName: item.get('displayName'),
    settings: item.get('settings'),
  }
  return type;
}