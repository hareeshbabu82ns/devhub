const EntityModel = require('../../db/models/Entity');

module.exports = {

  read: async () => {
    const res = await EntityModel.find();
    return res.map(item => {
      console.log(item)
      const type = {
        id: item.id,
        text: item.get('text'),
      }
      return type;
    });
  },
  update: async (id, data) => {
    const item = await EntityModel.findOneAndUpdate({ "_id": id }, data);
    // console.log(item)
    return item.id;
  },
  create: async (data) => {
    const item = await EntityModel.create(data);
    console.log(item)
    return item.id;
  },
  delete: async (id) => {
    const item = await EntityModel.deleteOne({ "_id": id });
    console.log(item)
    if (item.deletedCount === 1)
      return id;
    else
      return null;
  },
}