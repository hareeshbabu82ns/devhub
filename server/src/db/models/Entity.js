const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  text: String
});

const Entity = mongoose.model('Entity', schema, 'Entities');

module.exports = Entity;