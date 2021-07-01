import mongoose, { Schema, model, connect, Connection } from 'mongoose';

const dbConfig = {
  mdbHost: process.env['MONGO_DB_HOST'] || 'localhost',
  mdbPort: process.env['MONGO_DB_PORT'] || '21017',
  mdbDB: process.env['MONGO_DB_DB'] || 'test',
  mdbUser: process.env['MONGO_DB_USER'] || 'test',
  mdbPassword: process.env['MONGO_DB_PASSWORD'] || '',
}

export async function connectDB(): Promise<Connection> {
  const dbURL = `mongodb://${dbConfig.mdbUser}:${dbConfig.mdbPassword}@${dbConfig.mdbHost}:${dbConfig.mdbPort}/${dbConfig.mdbDB}`;
  await mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  return mongoose.connection;
}
