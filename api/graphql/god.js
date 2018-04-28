const { find } = require('lodash');
const { GodModel } = require('../db');

const God = `
type God { 
  id: String,
  title: String, 
  image: String, 
  items: Int 
}

extend type Query {
  god(id:String!):God
  godByTitle(title: String!): God
  gods: [God]
}
`;

const ResolversGod = {
  Query: {
    gods: () => GodModel.find({}).then(gods => gods),
    godByTitle: (_, { title }) => GodModel.findOne({ title }).then(god => god),
    god: (_, { id }) => GodModel.findById(id).then(god => god)
  },
  God: {
    id: (god) => god._id
  }
}

module.exports = { God, ResolversGod };