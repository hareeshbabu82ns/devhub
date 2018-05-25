const Mongoose = require('mongoose');

const ItemSchema = new Mongoose.Schema({
  title: String,
  descr: String,
  image: String,
  god: { type: Mongoose.Schema.Types.ObjectId, ref: 'God' }
});

const ItemModel = Mongoose.model('items', ItemSchema);

module.exports = ItemModel;
