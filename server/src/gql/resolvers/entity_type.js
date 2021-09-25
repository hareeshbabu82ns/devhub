const EntityTypeModel = require('../../db/models/EntityType')
const initData = require('./init_data.json')

module.exports = {

  init: async () => {
    // create default entity types
    await initData.entityTypes.map(({ name }) => EntityTypeModel.create({ name }))
  },

  read: async () => {
    const res = await EntityTypeModel.find();
    return res.map(item => {
      // console.log(item)
      const type = {
        id: item.id,
        name: item.get('name'),
        description: item.get('description'),
      }
      return type;
    });
  },
  update: async (id, data) => {
    const item = await EntityTypeModel.findOneAndUpdate({ "_id": id }, data);
    // console.log(item)
    return item.id;
  },
  create: async (data) => {
    const item = await EntityTypeModel.create(data);
    console.log(item)
    return item.id;
  },
  delete: async (id) => {
    const item = await EntityTypeModel.deleteOne({ "_id": id });
    console.log(item)
    if (item.deletedCount === 1)
      return id;
    else
      return null;
  },
}