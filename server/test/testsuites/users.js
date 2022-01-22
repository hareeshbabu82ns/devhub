const { expect, test } = require( "@jest/globals" )

const entityTypeFields = `
  displayName
  settings
`

function testSuits() {

  test( 'Should get all Users', async () => {
    const { data: { users } } = await this.apolloServer.executeOperation( { query: `query{users{${entityTypeFields}}}` } )
    expect( users ).toHaveLength( 3 )
    expect( users[ 0 ] ).toHaveProperty( 'displayName' )
    expect( users[ 0 ] ).toHaveProperty( 'settings' )
  } )
}

module.exports = { testSuits }