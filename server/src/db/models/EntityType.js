const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  description: String
});

const EntityType = mongoose.model('EntityType', schema, 'EntityTypes');

module.exports = EntityType;