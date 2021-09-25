const mongoose = require('mongoose')

const dbConfig = {
  mdbHost: process.env['MONGO_DB_HOST'] || 'localhost',
  mdbPort: process.env['MONGO_DB_PORT'] || '21017',
  mdbDB: process.env['MONGO_DB_DB'] || 'test',
  mdbUser: process.env['MONGO_DB_USER'] || 'test',
  mdbPassword: process.env['MONGO_DB_PASSWORD'] || '',
}

async function connectDB() {
  const dbURL = `mongodb://${dbConfig.mdbUser}:${dbConfig.mdbPassword}@${dbConfig.mdbHost}:${dbConfig.mdbPort}/${dbConfig.mdbDB}`;
  try {

    await mongoose.connect(dbURL, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
    });
    mongoose.set('debug', true);
    console.log("Database connection established")
    return mongoose.connection;
  } catch (e) {
    console.log("Database connection failed")
    throw e
  }
}

module.exports = connectDB