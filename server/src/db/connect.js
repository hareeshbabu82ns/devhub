const mongoose = require( 'mongoose' )

async function connectDB( { mdbUser, mdbPassword, mdbHost, mdbPort, mdbDB, debug = false } ) {
  const dbURL = `mongodb://${mdbUser}:${mdbPassword}@${mdbHost}:${mdbPort}/${mdbDB}`;
  try {

    await mongoose.connect( dbURL, {
      connectTimeoutMS: 500,
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useFindAndModify: false,
    } );
    mongoose.set( 'debug', debug );
    // console.log("Database connection established")
    return mongoose.connection;
  } catch ( e ) {
    console.log( "Database connection failed" )
    throw e
  }
}

module.exports = connectDB