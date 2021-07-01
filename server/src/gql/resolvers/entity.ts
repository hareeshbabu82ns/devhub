import { Entity } from '../schema';
import EntityModel from '../../db/models/Entity';

export default {

  read: async () => {
    const res = await EntityModel.find();
    return res.map(item => {
      // console.log(item)
      const type: Entity = {
        id: item.id,
        text: item.get('text'),
      }
      return type;
    });
  },
  update: async (id: String, data: Object) => {
    const item = await EntityModel.findOneAndUpdate({ "_id": id }, data);
    // console.log(item)
    return item.id;
  },
  create: async (data: Object) => {
    const item = await EntityModel.create(data);
    console.log(item)
    return item.id;
  },
  delete: async (id: String) => {
    const item = await EntityModel.deleteOne({ "_id": id });
    console.log(item)
    if (item.n === 1)
      return id as string;
    else
      return null;
  },
}