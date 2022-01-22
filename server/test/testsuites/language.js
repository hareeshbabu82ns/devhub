const { expect, test } = require( "@jest/globals" )

const languageFields = `
  iso
  name
  description
`

function testSuits() {

  test( 'Should get all Languages', async () => {
    const { data: { languages } } = await this.apolloServer.executeOperation( { query: `query{languages{${languageFields}}}` } )
    expect( languages ).toHaveLength( 3 )
    expect( languages[ 0 ] ).toHaveProperty( 'iso' )
    expect( languages[ 0 ] ).toHaveProperty( 'name' )
    expect( languages[ 0 ] ).toHaveProperty( 'description' )

  } )
}

module.exports = { testSuits }