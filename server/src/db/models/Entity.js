const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  text: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  parents: [mongoose.Types.ObjectId],
  children: [mongoose.Types.ObjectId]
});

const Entity = mongoose.model('Entity', schema, 'Entities');

module.exports = Entity;