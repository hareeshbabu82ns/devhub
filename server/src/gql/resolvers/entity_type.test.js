const { expect, test } = require( "@jest/globals" );
const mongoose = require( "mongoose" );
const _ = require( 'lodash' )
const buildApolloServer = require( "../apollo_server" )
const { testData, initEntityTypes, cleanupEntityTypes } = require( './entity_type.test.utils' )
const { GET_ENTITY_TYPES_BY, CREATE_ENTITY_TYPE, UPDATE_ENTITY_TYPE, DELETE_ENTITY_TYPE } = require( './entity_type.queries' )

describe( 'GQL - Entity Type Tests', () => {

  let apolloServer
  const createdIds = []

  beforeAll( async () => {
    apolloServer = await buildApolloServer( { debug: false } )
    const ids = await initEntityTypes( { apolloServer, testData: testData.createEntityTypes } )
    createdIds.push( ...ids )
  } )

  afterAll( async () => {
    const ids = await cleanupEntityTypes( { apolloServer, ids: createdIds } )
    const finalIds = createdIds.filter( id => !ids.includes( id ) )
    expect( finalIds.length ).toEqual( 0 )
    return mongoose.disconnect()
  } )

  test( 'fetch all entityTypes', async () => {
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY } )
    expect( res.data.entityTypes.length ).toBeGreaterThan( 0 )
  } )

  test( 'fetch by entityType code', async () => {
    const entityTypesBy = {
      code: {
        value: "GOD"
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.data.entityTypes.length ).toEqual( 1 )
    expect( res.data.entityTypes[ 0 ].code ).toEqual( "GOD" )
  } )

  test( 'fetch by entityType code - logical - AND', async () => {
    const entityTypesBy = {
      and: [
        {
          code: {
            operation: "REGEX",
            valueString: "^A"
          }
        },
        {
          name: {
            path: "value",
            operation: "REGEX",
            value: ".*or Eng$"
          }
        }
      ]
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.data.entityTypes.length ).toEqual( 1 )
    expect( res.data.entityTypes[ 0 ].code ).toEqual( "AUTHOR" )
  } )

  test( 'fetch by entityType code - logical - OR', async () => {
    const entityTypesBy = {
      or: [
        {
          code: {
            value: "GOD"
          }
        },
        {
          name: {
            path: "value",
            value: "Author Eng"
          }
        }
      ]
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.data.entityTypes.length ).toEqual( 2 )
    expect( res.data.entityTypes.filter( e => e.code === "GOD" )[ 0 ].code ).toEqual( "GOD" )
  } )

  test( 'fetch by entityType code - filter - IN', async () => {
    const entityTypesBy = {
      code: {
        operation: "IN",
        valueList: [ "GOD", "AUTHOR" ]
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.data.entityTypes.length ).toEqual( 2 )
  } )

  test( 'fetch by entityType code - filter - Regex', async () => {
    const entityTypesBy = {
      code: {
        operation: "REGEX",
        valueString: "^G"
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.data.entityTypes[ 0 ].code.charAt( 0 ) ).toEqual( "G" )
  } )

  test( 'should fail - missing default filter - value', async () => {
    const entityTypesBy = {
      code: {
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.errors.length ).toBeGreaterThan( 0 )
  } )

  test( 'should fail - missing filter - value', async () => {
    const entityTypesBy = {
      code: {
        operation: "REGEX",
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.errors.length ).toBeGreaterThan( 0 )
  } )

  test( 'should fail - missing filter - valueList', async () => {
    const entityTypesBy = {
      code: {
        operation: "IN",
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( res.errors.length ).toBeGreaterThan( 0 )
  } )


  test( 'should create and delete entityType', async () => {

    // create entityType
    const withData = {
      code: "GOD",
      name: [
        { language: "SAN", value: "Ganesha" },
        { language: "ENG", value: "Ganesha Eng" },
      ],
      description: "Ganesha EntityType"
    }
    const resCreate = await apolloServer.executeOperation( { query: CREATE_ENTITY_TYPE, variables: { withData } } )
    expect( resCreate.data.createdId ).toBeDefined()

    // update entityType
    const updateWithData = {
      description: "Test Type Descr"
    }
    const resUpdate = await apolloServer.executeOperation( {
      query: UPDATE_ENTITY_TYPE,
      variables: { id: resCreate.data.createdId, withData: updateWithData }
    } )
    expect( resUpdate.data.updatedId ).toEqual( resCreate.data.createdId )

    // read entityType to validate
    const entityTypesBy = {
      id: {
        value: resCreate.data.createdId
      }
    }
    const resSearch = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    expect( resSearch.data.entityTypes[ 0 ].description ).toEqual( updateWithData.description )

    // delete above entityType
    const resDelete = await apolloServer.executeOperation( { query: DELETE_ENTITY_TYPE, variables: { id: resCreate.data.createdId } } )
    expect( resDelete.data.deletedId ).toEqual( resCreate.data.createdId )
  } )

  test( 'should transliterate entityType name', async () => {

    const withData = testData.transliteration.input
    const resCreate = await apolloServer.executeOperation( { query: CREATE_ENTITY_TYPE, variables: { withData } } )
    expect( resCreate.data.createdId ).toBeDefined()

    // read entityType to validate
    const entityTypesBy = {
      id: {
        value: resCreate.data.createdId
      }
    }
    const resSearch = await apolloServer.executeOperation( { query: GET_ENTITY_TYPES_BY, variables: { entityTypesBy } } )
    const dbName = _.find( resSearch.data.entityTypes[ 0 ].nameData, { language: 'TEL' } )?.value
    const testName = _.find( testData.transliteration.output.name, { language: 'TEL' } )?.value
    expect( dbName ).toEqual( testName )

  } )

  test( 'should fail to update entityType if not exist', async () => {
    const updateWithData = {
      description: "Test Lang Descr"
    }
    const resUpdate = await apolloServer.executeOperation( {
      query: UPDATE_ENTITY_TYPE,
      variables: { id: 'randomupdateid', withData: updateWithData }
    } )
    expect( resUpdate.errors ).toBeDefined()
  } )

  test( 'should fail to delete entityType if not exist', async () => {
    const resDelete = await apolloServer.executeOperation( { query: DELETE_ENTITY_TYPE, variables: { id: '6152755b9d74594e04aaa67e' } } )
    expect( resDelete.errors ).toBeDefined()
  } )

} )