import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: String
});

const Entity = mongoose.model('Entity', schema);

export default Entity;