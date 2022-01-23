const { expect, test } = require( "@jest/globals" )

const entityFields = `
  type
  text {
    iso
    text
  }
`

function testSuits() {

  test( 'Should get all Entitities', async () => {
    const { data: { entities } } = await this.apolloServer.executeOperation( { query: `query{entities{${entityFields}}}` } )
    expect( entities ).toHaveLength( 3 )
    expect( entities[ 0 ] ).toHaveProperty( 'type' )
    expect( entities[ 0 ] ).toHaveProperty( 'text' )
    expect( entities[ 0 ].text ).toHaveLength( 2 )
    expect( entities[ 0 ].text[ 0 ] ).toHaveProperty( 'iso' )
    expect( entities[ 0 ].text[ 0 ] ).toHaveProperty( 'text' )
  } )

}

module.exports = { testSuits }