const path = require( 'path' )

const loadDBConfig = ( dbConfig ) => {
  if ( !dbConfig || !dbConfig.mdbHost ) {
    require( 'dotenv' ).config( {
      path: dbConfig.envFilePath || path.resolve( process.cwd(), './', dbConfig.envFile || '.env.local' )
    } )
    return {
      mdbHost: process.env[ 'MONGO_DB_HOST' ],
      mdbPort: process.env[ 'MONGO_DB_PORT' ],
      mdbDB: process.env[ 'MONGO_DB_DB' ],
      mdbUser: process.env[ 'MONGO_DB_USER' ],
      mdbPassword: process.env[ 'MONGO_DB_PASSWORD' ],
    }
    // console.log( useDBConfig )
  }
  return dbConfig
}

module.exports = { loadDBConfig }