const { expect, test } = require( "@jest/globals" )
const { gql } = require( "apollo-server-core" )
const { MongoClient } = require( 'mongodb' )
const buildApolloServer = require( "../src/gql/apollo_server" )
const { data } = require( './fixtures/language' )
const { testSuits } = require( './testsuites/language' )
const { connectToDB, clearDBCollections, importData } = require( './testsuites/utils' )



describe( 'Tests on fixtures/languages.js', function () {
    jest.setTimeout( 20000 )

    beforeAll( async () => {
        this.apolloServer = await buildApolloServer( { grapi: true, envFile: '.env.test.local', debug: false } )
        const { client, db } = await connectToDB( { envFile: '.env.test.local' } )
        this.client = client
        this.db = db
        await importData( { db, collection: 'Languages', data: data.initData } )
        return this.apolloServer.start()
    } )

    afterAll( async () => {
        await clearDBCollections( this.db )
        await this.client.close()
        return this.apolloServer.stop()
    } )

    testSuits.call( this )
} )
