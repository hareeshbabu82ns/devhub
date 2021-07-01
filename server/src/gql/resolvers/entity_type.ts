import { EntityType } from '../schema';
import EntityTypeModel from '../../db/models/EntityType';
import * as initData from './init_data.json'

export default {

  init: async () => {
    // create default entity types
    await initData.entityTypes.map(({ name }) => EntityTypeModel.create({ name }))
  },

  read: async () => {
    const res = await EntityTypeModel.find();
    return res.map(item => {
      // console.log(item)
      const type: EntityType = {
        id: item.id,
        name: item.get('name'),
        description: item.get('description'),
      }
      return type;
    });
  },
  update: async (id: String, data: Object) => {
    const item = await EntityTypeModel.findOneAndUpdate({ "_id": id }, data);
    // console.log(item)
    return item.id;
  },
  create: async (data: Object) => {
    const item = await EntityTypeModel.create(data);
    console.log(item)
    return item.id;
  },
  delete: async (id: String) => {
    const item = await EntityTypeModel.deleteOne({ "_id": id });
    console.log(item)
    if (item.n === 1)
      return id as string;
    else
      return null;
  },
}