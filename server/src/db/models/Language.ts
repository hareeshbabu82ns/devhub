import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  iso: String,
  name: String,
  description: String
});

const Language = mongoose.model('Language', schema, 'Languages');

export default Language;