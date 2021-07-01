import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  text: String
});

const Entity = mongoose.model('Entity', schema, 'Entities');

export default Entity;