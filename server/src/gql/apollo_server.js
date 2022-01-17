const { ApolloServer } = require( 'apollo-server-express' )
const { GraphQLFileLoader } = require( '@graphql-tools/graphql-file-loader' )
const { loadSchemaSync } = require( '@graphql-tools/load' )
const { addResolversToSchema } = require( '@graphql-tools/schema' )
const { Grapi } = require( '@terabits/grapi' )
const { MongodbDataSourceGroup } = require( '@terabits/grapi-mongodb' )

const connectToDB = require( "../db/connect" )
const path = require( 'path' )
const { readFileSync } = require( 'fs' )

const getDataSource = async ( { mdbUser, mdbPassword, mdbHost, mdbPort, mdbDB } ) => {
  const dbURL = `mongodb://${mdbUser}:${mdbPassword}@${mdbHost}:${mdbPort}/${mdbDB}`;
  try {
    const datasource = new MongodbDataSourceGroup( dbURL, mdbDB )
    await datasource.initialize()
    console.log( 'connected to database' )
    return datasource
  } catch ( e ) {
    console.log( "Database connection failed" )
    throw e
  }
}

const loadDBConfig = ( dbConfig ) => {

  if ( !dbConfig ) {
    require( 'dotenv' ).config( {
      path: envFilePath || path.resolve( process.cwd(), './', envFile || '.env.local' )
    } )
    return {
      mdbHost: process.env[ 'MONGO_DB_HOST' ],
      mdbPort: process.env[ 'MONGO_DB_PORT' ],
      mdbDB: process.env[ 'MONGO_DB_DB' ],
      mdbUser: process.env[ 'MONGO_DB_USER' ],
      mdbPassword: process.env[ 'MONGO_DB_PASSWORD' ],
    }
    // console.log(useDBConfig)
  }
  return dbConfig
}

async function buildApolloServer( config ) {
  return config?.grapi ? buildGrapiServer( config ) : buildBasicServer( config )
}

async function buildGrapiServer( { schema, plugins, dbConfig, envFilePath, envFile, contextValues = {}, debug } = {} ) {

  var useDBConfig = loadDBConfig( { ...dbConfig, envFilePath, envFile } )
  const dataSource = await getDataSource( useDBConfig )

  const sdl = readFileSync( path.join( __dirname, './grapi', 'schema.graphql' ), { encoding: 'utf8' } )
  const grapiServer = new Grapi( {
    sdl,
    dataSources: {
      mdb: ( args ) => dataSource.getDataSource( args.key ),
    },
    // plugins: [
    //   new TestQueryPlugin(),
    // ]
  } )
  const apolloConfig = grapiServer.createApolloConfig()

  const usePlugins = [
    ...plugins,
  ]

  if ( apolloConfig?.plugins ) {
    usePlugins.push( apolloConfig.plugins )
  }

  // console.log( apolloConfig )

  const server = new ApolloServer( {
    ...apolloConfig,
    plugins: usePlugins,
    context: ( { req } ) => ( {
      dataSource,
      ...contextValues,
    } ),
  } )

  return server
}

async function buildBasicServer( { schema, plugins, dbConfig, envFilePath, envFile, contextValues = {}, debug } = {} ) {

  var useDBConfig = loadDBConfig( { ...dbConfig, envFilePath, envFile } )

  var useSchema = schema
  if ( !schema ) {
    const schemaOnly = loadSchemaSync( path.join( __dirname, "./schema/*.graphql" ),
      { loaders: [ new GraphQLFileLoader() ] } )
    const resolvers = require( './resolvers' )
    useSchema = addResolversToSchema( { schema: schemaOnly, resolvers, } );
  }

  const dbConnection = await connectToDB( { ...useDBConfig, debug } )
  const server = new ApolloServer( {
    schema: useSchema,
    // context: initContext,
    context: ( { req } ) => ( {
      dbConnection,
      ...contextValues,
    } ),
    plugins,
  } )

  return server
}

module.exports = buildApolloServer