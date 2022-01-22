const { expect, test } = require( "@jest/globals" )

const entityTypeFields = `
  code
  name
  description
`

function testSuits() {

  test( 'Should get all EntityTypes', async () => {
    const { data: { entitytypes } } = await this.apolloServer.executeOperation( { query: `query{entitytypes{${entityTypeFields}}}` } )
    expect( entitytypes ).toHaveLength( 3 )
    expect( entitytypes[ 0 ] ).toHaveProperty( 'code' )
    expect( entitytypes[ 0 ] ).toHaveProperty( 'name' )
    expect( entitytypes[ 0 ] ).toHaveProperty( 'description' )
  } )
}

module.exports = { testSuits }