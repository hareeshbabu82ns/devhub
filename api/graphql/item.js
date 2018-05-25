const { find } = require('lodash');
const { ItemModel, GodModel } = require('../db');

const Item = `
type Item {
  id: String,
  title: String,
  image: String,
  god: God
}

extend type Query {
  item(id:String!):Item
  itemsByGod(godId: String!): [Item]
  items: [Item]
}
`;

const ResolversItem = {
  Query: {
    items: (_, __, { request }) => {
      console.log(request.body);
      return ItemModel.find({}).then(items => items);
    },
    itemsByGod: (_, { godId }) => ItemModel.find({ god: godId }).then(items => items),
    item: (_, { id }) => ItemModel.findById(id).then(item => item)
  },
  Item: {
    id: (item) => item._id,
    god: (item) => GodModel.findById(item.god).then(item => item)
  }
}

module.exports = { Item, ResolversItem };