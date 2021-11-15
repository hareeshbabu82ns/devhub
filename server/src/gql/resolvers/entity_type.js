const EntityTypeModel = require('../../db/models/EntityType')
const initData = require('./init_data.json')
const { buildQueryFilter } = require('./utils');

module.exports = {

  init: async () => {
    // create default entity types
    const asyncList = initData.entityTypes.map(({ code, name }) => EntityTypeModel.create({ code, name }))
    await Promise.all(asyncList)
  },

  read: async (args, requestedFields) => {
    const query = EntityTypeModel.find();

    if (args.by) {
      buildQueryFilter(query, args.by);
    }
    query.limit(args.limit);

    query.select(requestedFields.join(' '));
    const res = await query.exec();
    return res.map(mapModelToGQL);
  },
  update: async (id, data) => {
    const item = await EntityTypeModel.findOneAndUpdate({ "_id": id }, { $set: { ...data } });
    // console.log(item)
    return item.id;
  },
  create: async (data) => {
    const item = await EntityTypeModel.create(data);
    // console.log(item)
    return item.id;
  },
  delete: async (id) => {
    const item = await EntityTypeModel.deleteOne({ "_id": id });
    // console.log(item)
    if (item.deletedCount === 1)
      return id;
    else
      throw `Nothing deleted with matching id: ${id}`;
  },
}

const mapModelToGQL = (item) => {
  // console.log(item.toJSON())
  const type = {
    id: item.id,
    code: item.get('code'),
    name: item.get('name'),
    description: item.get('description'),
  }
  return type;
}