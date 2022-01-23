const { expect, test } = require( "@jest/globals" )

const languageFields = `
  iso
  name
  nameISO
  description
`

function testSuits() {

  test( 'Should get all Languages', async () => {
    const { data: { languages } } = await this.apolloServer.executeOperation( { query: `query{languages{${languageFields}}}` } )
    expect( languages ).toHaveLength( 3 )
    expect( languages[ 0 ] ).toHaveProperty( 'iso' )
    expect( languages[ 0 ] ).toHaveProperty( 'name' )
    expect( languages[ 0 ] ).toHaveProperty( 'nameISO' )
  } )

  test( 'Should create New Language', async () => {
    const data = { iso: "HIN", name: "Hindi", nameISO: "Hindi", description: "Hin desc" }
    const language = await createLanguage( { server: this.apolloServer, data } )
    expect( language ).toBeTruthy()
    expect( language ).toHaveProperty( 'iso' )
    expect( language ).toHaveProperty( 'name' )
    expect( language ).toHaveProperty( 'nameISO' )
  } )

  test( 'Should delete Language', async () => {
    const dataCreate = { iso: "HIN", name: "Hindi", nameISO: "Hindi", description: "Hin desc" }
    const languageCreated = await createLanguage( { server: this.apolloServer, data: dataCreate } )

    const where = { id: languageCreated.id, iso: dataCreate.iso }
    const language = await deleteLanguage( { server: this.apolloServer, where } )
    expect( language ).toBeTruthy()
    expect( language ).toHaveProperty( 'iso' )
    expect( language.iso ).toEqual( dataCreate.iso )
  } )

  test( 'Should update Language', async () => {
    const dataCreate = { iso: "HIN", name: "Hindi", nameISO: "Hindi", description: "Hin desc" }
    const languageCreated = await createLanguage( { server: this.apolloServer, data: dataCreate } )

    const where = { id: languageCreated.id, iso: dataCreate.iso }
    const data = { name: "HindiChg" }
    const language = await updateLanguage( { server: this.apolloServer, where, data } )
    expect( language ).toBeTruthy()
    expect( language ).toHaveProperty( 'name' )
    expect( language.name ).not.toEqual( dataCreate.name )
  } )

}

const createLanguageMutation = `
  mutation create($data: LanguageCreateInput!){
    createdItem: createLanguage(data:$data){
      id
      ${languageFields}
    }
  }
`

async function createLanguage( { server, data } ) {
  const { data: { createdItem } } = await server.executeOperation( { query: createLanguageMutation, variables: { data } } )
  return createdItem
}

const deleteLanguageMutation = `
  mutation delete($where: LanguageWhereUniqueInput!){
    deletedItem: deleteLanguage(where:$where){
      id
      ${languageFields}
    }
  }
`

async function deleteLanguage( { server, where } ) {
  const res = await server.executeOperation( { query: deleteLanguageMutation, variables: { where } } )
  console.log( res )
  return res.data.deletedItem
}

const updateLanguageMutation = `
  mutation update($where: LanguageWhereUniqueInput!, $data: LanguageUpdateInput!){
    updatedItem: updateLanguage(where:$where, data:$data){
      id
      ${languageFields}
    }
  }
`

async function updateLanguage( { server, where, data } ) {
  const res = await server.executeOperation( { query: updateLanguageMutation, variables: { where, data } } )
  // console.log( res )
  return res.data.updatedItem
}

module.exports = { testSuits, createLanguage, deleteLanguage, updateLanguage }