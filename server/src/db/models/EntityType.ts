import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String,
  description: String
});

const EntityType = mongoose.model('EntityType', schema, 'EntityTypes');

export default EntityType;