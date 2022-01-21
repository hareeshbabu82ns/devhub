const { MongoClient } = require( 'mongodb' )
const { loadDBConfig } = require( '../../src/db/utils' )


async function clearDBCollections( db ) {
  const listCollectionsQuery = await db.listCollections()
  const collections = await listCollectionsQuery.toArray()
  return Promise.all( collections.map( async collection => {
    await db.collection( collection.name ).deleteMany( {} )
  } ) )
}

const importData = async ( { db, collection, data } ) => {
  const coll = await db.collection( collection )
  await coll.insertMany( data )
}

async function connectToDB( { envFile } ) {
  const dbConfig = loadDBConfig( { envFile } )
  const dbURL = `mongodb://${dbConfig.mdbUser}:${dbConfig.mdbPassword}@${dbConfig.mdbHost}:${dbConfig.mdbPort}/${dbConfig.mdbDB}`;
  const client = await MongoClient.connect( dbURL, { useUnifiedTopology: true } )
  const db = await client.db( dbConfig.mdbDB )
  return { client, db }
}

module.exports = { connectToDB, clearDBCollections, importData }