import { GraphQLResolveInfo } from 'graphql';
import { FilterOperation, Language, QueryLanguagesArgs } from '../schema';
import LanguageModel from '../../db/models/Language';
import * as initData from './init_data.json'
import { buildQueryFilter } from './utils';

export default {

  init: async () => {
    // create default entity types
    await initData.languages.map(({ iso, name, description }) => LanguageModel.create({ iso, name, description }))
  },

  read: async (args: QueryLanguagesArgs, requestedFields: Array<String>) => {
    const query = LanguageModel.find();

    if (args.by) {
      buildQueryFilter(query, args.by);
    }
    query.limit(args.limit);

    query.select(requestedFields.join(' '));
    const res = await query.exec();
    return res.map(mapModelToGQL);
  },
  update: async (id: String, data: Object) => {
    const item = await LanguageModel.findOneAndUpdate({ "_id": id }, data);
    // console.log(item)
    return item.id;
  },
  create: async (data: Object) => {
    const item = await LanguageModel.create(data);
    console.log(item)
    return item.id;
  },
  delete: async (id: String) => {
    const item = await LanguageModel.deleteOne({ "_id": id });
    console.log(item)
    if (item.n === 1)
      return id as string;
    else
      return null;
  },
}

const mapModelToGQL = (item: any): Language => {
  // console.log(item)
  const type: Language = {
    id: item.id,
    iso: item.get('iso'),
    name: item.get('name'),
    description: item.get('description'),
  }
  return type;
}