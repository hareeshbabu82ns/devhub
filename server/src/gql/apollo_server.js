const { ApolloServer } = require( 'apollo-server-express' )
const { GraphQLFileLoader } = require( '@graphql-tools/graphql-file-loader' )
const { loadSchemaSync } = require( '@graphql-tools/load' )
const { addResolversToSchema } = require( '@graphql-tools/schema' )
const { Grapi } = require( '@terabits/grapi' )
const { MongodbDataSourceGroup } = require( '@terabits/grapi-mongodb' )

const { loadDBConfig } = require( '../db/utils' )

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
    skipPrint: !debug,
  } )
  const apolloConfig = grapiServer.createApolloConfig()

  const usePlugins = [
    ...plugins || [],
    {
      async serverWillStart() {
        // do some initializations on server start
        // console.log( 'server starting' )
        return {
          async drainServer() {
            // do cleanup at server stop
            // console.log( 'drain server' )
            await dataSource.close()
          }
        }
      }
    },
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