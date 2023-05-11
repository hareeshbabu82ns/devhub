const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  displayName: String,
  settings: String,
});

const User = mongoose.model('User', schema, 'Users');

module.exports = User;