import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  displayName: String,
  settings: String,
});

const User = mongoose.model('User', schema, 'Users');

export default User;