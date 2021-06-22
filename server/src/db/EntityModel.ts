import mongoose from 'mongoose';

const entitySchema = new mongoose.Schema({
  name: String
});

const Entity = mongoose.model('Entity', entitySchema);

export default Entity;