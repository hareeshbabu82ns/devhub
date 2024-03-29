const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  iso: String,
  name: String,
  description: String
});

const Language = mongoose.model('Language', schema, 'Languages');

module.exports = Language;