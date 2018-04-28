const Mongoose = require('mongoose');

const mongodbURL = process.env.MONGODB_URL;

// somewhere in the middle:
Mongoose.Promise = global.Promise;

console.log('URL: ', mongodbURL);

const mongoose = Mongoose.connect(mongodbURL);

const GodModel = require('./god-model')

module.exports = { GodModel };