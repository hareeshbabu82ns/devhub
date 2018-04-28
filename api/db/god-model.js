const Mongoose = require('mongoose');

const GodSchema = new Mongoose.Schema({
  title: String,
  image: String,
  items: Number
});

const GodModel = Mongoose.model('gods', GodSchema);

module.exports = GodModel;
