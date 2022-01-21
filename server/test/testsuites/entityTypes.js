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

  } )
}

module.exports = { testSuits }