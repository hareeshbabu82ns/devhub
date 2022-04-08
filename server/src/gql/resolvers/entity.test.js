const { expect, test } = require( "@jest/globals" );
const mongoose = require( "mongoose" );
const buildApolloServer = require( "../apollo_server" )
const { testData, initEntities, cleanupEntities } = require( './entity.test.utils' )
const { CREATE_ENTITY, GET_ENTITIES_BY, UPDATE_ENTITY, DELETE_ENTITY } = require( './entity.queries' )


describe( 'GQL - Entity Type Tests', () => {

  let apolloServer
  const createdIds = []

  beforeAll( async () => {
    apolloServer = await buildApolloServer( { debug: false } )
    const ids = await initEntities( { apolloServer, testData: testData.createEntities } )
    createdIds.push( ...ids )
  } )

  afterAll( async () => {
    const ids = await cleanupEntities( { apolloServer, ids: createdIds } )
    const finalIds = createdIds.filter( id => !ids.includes( id ) )
    expect( finalIds.length ).toEqual( 0 )
    return mongoose.disconnect()
  } )

  test( 'fetch all entities', async () => {
    const res = await apolloServer.executeOperation( { query: GET_ENTITIES_BY } )
    expect( res.data.entities.length ).toBeGreaterThan( 0 )
  } )

  test( 'fetch by entity type', async () => {
    const entitiesBy = testData.search.byType
    const res = await apolloServer.executeOperation( {
      query: GET_ENTITIES_BY,
      variables: { entitiesBy },
    } )
    expect( res.data.entities.length ).toBeGreaterThan( 0 )
    expect( res.data.entities[ 0 ].type ).toEqual( entitiesBy.type.value )
  } )

  test( 'fetch by entity type - logical - AND', async () => {
    const res = await apolloServer.executeOperation( {
      query: GET_ENTITIES_BY,
      variables: { entitiesBy: testData.search.byAnd },
    } )
    expect( res.data.entities.length ).toBeGreaterThan( 0 )
    expect( res.data.entities[ 0 ].type ).toEqual( "SLOKAM" )
  } )

  test( 'fetch by entity type - logical - OR', async () => {
    const res = await apolloServer.executeOperation( {
      query: GET_ENTITIES_BY,
      variables: { entitiesBy: testData.search.byOr },
    } )
    expect( res.data.entities.length ).toBeGreaterThan( 0 )
    expect( res.data.entities.filter( e => e.type === "GOD" )[ 0 ].type ).toEqual( "GOD" )
  } )

  test( 'fetch by entity type - filter - IN', async () => {
    const res = await apolloServer.executeOperation( {
      query: GET_ENTITIES_BY,
      variables: { entitiesBy: testData.search.byIn },
    } )
    expect( res.data.entities.length ).toBeGreaterThanOrEqual( 2 )
  } )

  test( 'fetch by entity type - filter - Regex', async () => {
    const res = await apolloServer.executeOperation( {
      query: GET_ENTITIES_BY,
      variables: { entitiesBy: testData.search.byRegex },
    } )
    expect( res.data.entities[ 0 ].type.charAt( 0 ) ).toEqual( "G" )
  } )

  test( 'should fail - missing default filter - value', async () => {
    const entitiesBy = {
      type: {
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITIES_BY, variables: { entitiesBy } } )
    expect( res.errors.length ).toBeGreaterThan( 0 )
  } )

  test( 'should fail - missing filter - value', async () => {
    const entitiesBy = {
      type: {
        operation: "REGEX",
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITIES_BY, variables: { entitiesBy } } )
    expect( res.errors.length ).toBeGreaterThan( 0 )
  } )

  test( 'should fail - missing filter - valueList', async () => {
    const entitiesBy = {
      type: {
        operation: "IN",
      }
    }
    const res = await apolloServer.executeOperation( { query: GET_ENTITIES_BY, variables: { entitiesBy } } )
    expect( res.errors.length ).toBeGreaterThan( 0 )
  } )


  test( 'should create and delete entity', async () => {

    // create entity
    const resCreate = await apolloServer.executeOperation( {
      query: CREATE_ENTITY,
      variables: { withData: testData.simple.create },
    } )
    // console.log(resCreate)
    expect( resCreate.data.createdId ).toBeDefined()

    // update entity
    const resUpdate = await apolloServer.executeOperation( {
      query: UPDATE_ENTITY,
      variables: { id: resCreate.data.createdId, withData: testData.simple.update }
    } )
    // console.log(resUpdate)
    expect( resUpdate.data.updatedId ).toEqual( resCreate.data.createdId )

    // read entity to validate
    const entitiesBy = {
      id: {
        value: resCreate.data.createdId
      }
    }
    const resSearch = await apolloServer.executeOperation( {
      query: GET_ENTITIES_BY,
      variables: { entitiesBy }
    } )
    // console.log(resSearch)
    expect( resSearch.data.entities[ 0 ].text ).toEqual( testData.simple.update.text[ 0 ].value )

    // delete above entity
    const resDelete = await apolloServer.executeOperation( {
      query: DELETE_ENTITY,
      variables: { id: resCreate.data.createdId }
    } )
    expect( resDelete.data.deletedId ).toEqual( resCreate.data.createdId )
  } )

  test( 'should fail to update entity if not exist', async () => {
    const updateWithData = {
      description: "Test Lang Descr"
    }
    const resUpdate = await apolloServer.executeOperation( {
      query: UPDATE_ENTITY,
      variables: { id: 'randomupdateid', withData: updateWithData }
    } )
    expect( resUpdate.errors ).toBeDefined()
  } )

  test( 'should fail to delete entity if not exist', async () => {
    const resDelete = await apolloServer.executeOperation( {
      query: DELETE_ENTITY,
      variables: { id: '6152755b9d74594e04aaa67e' }
    } )
    expect( resDelete.errors ).toBeDefined()
  } )

  test( 'should create and delete entity with children', async () => {
    const withData = testData.createWithChildren.simple
    // create entity
    const resCreate = await apolloServer.executeOperation( {
      query: CREATE_ENTITY,
      variables: { withData },
    } )
    // console.log(resCreate)
    expect( resCreate.data.createdId ).toBeDefined()
    // push it for cleanup
    createdIds.push( resCreate.data.createdId )

    // read entity to validate
    const entitiesBy = {
      id: {
        value: resCreate.data.createdId
      }
    }
    const resSearch = await apolloServer.executeOperation( {
      query: GET_ENTITIES_BY,
      variables: { entitiesBy }
    } )
    // console.log(resSearch)
    expect( resSearch.data.entities[ 0 ].text ).toEqual(
      withData.text.filter( text => text.language === "ENG" )[ 0 ].value )
    expect( resSearch.data.entities[ 0 ].children[ 0 ].text ).toEqual(
      withData.children[ 0 ].text.filter( text => text.language === "ENG" )[ 0 ].value
    )
  } )

} )