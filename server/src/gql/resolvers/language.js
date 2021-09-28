const { GraphQLResolveInfo } = require('graphql');
const LanguageModel = require('../../db/models/Language');
const initData = require('./init_data.json')
const { buildQueryFilter } = require('./utils');

module.exports = {

  init: async () => {
    // create default entity types
    await initData.languages.map(({ iso, name, description }) => LanguageModel.create({ iso, name, description }))
  },

  read: async (args, requestedFields) => {
    const query = LanguageModel.find();

    if (args.by) {
      buildQueryFilter(query, args.by);
    }
    query.limit(args.limit);

    query.select(requestedFields.join(' '));
    const res = await query.exec();
    return res.map(mapModelToGQL);
  },
  update: async (id, data) => {
    const item = await LanguageModel.findOneAndUpdate({ "_id": id }, data, { upsert: true });
    // console.log(item)
    return item.id;
  },
  create: async (data) => {
    const item = await LanguageModel.create(data);
    console.log(item)
    return item.id;
  },
  delete: async (id) => {
    const item = await LanguageModel.deleteOne({ "_id": id });
    console.log(item)
    if (item.deletedCount === 1)
      return id;
    else
      return null;
  },
}

const mapModelToGQL = (item) => {
  // console.log(item)
  const type = {
    id: item.id,
    iso: item.get('iso'),
    name: item.get('name'),
    description: item.get('description'),
  }
  return type;
}