const { expect, test } = require("@jest/globals");
const mongoose = require("mongoose");
const buildApolloServer = require("../apollo_server")
const { testData, initLanguages, cleanupLanguages } = require('./language.test.utils')
const { CREATE_LANGUAGE, GET_LANGUAGES_BY,
  UPDATE_LANGUAGE, DELETE_LANGUAGE } = require('./language.queries')

describe('GQL - Lanuage Tests', () => {

  let apolloServer
  const createdIds = []

  beforeAll(async () => {
    apolloServer = await buildApolloServer({ debug: false })
    const ids = await initLanguages({ apolloServer, testData: testData.createLanguages })
    createdIds.push(...ids)
  })

  afterAll(async () => {
    const ids = await cleanupLanguages({ apolloServer, ids: createdIds })
    const finalIds = createdIds.filter(id => !ids.includes(id))
    expect(finalIds.length).toEqual(0)
    return mongoose.disconnect()
  })

  test('fetch all languages', async () => {
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY })
    expect(res.data.languages.length).toBeGreaterThan(0)
  })

  test('fetch by language iso', async () => {
    const languagesBy = {
      iso: {
        value: "SAN"
      }
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.data.languages.length).toEqual(1)
    expect(res.data.languages[0].iso).toEqual("SAN")
  })

  test('fetch by language iso - logical - AND', async () => {
    const languagesBy = {
      and: [
        {
          iso: {
            operation: "REGEX",
            value: "^TE"
          }
        },
        {
          description: {
            operation: "REGEX",
            value: ".*gu$"
          }
        }
      ]
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.data.languages.length).toEqual(1)
    expect(res.data.languages[0].iso).toEqual("TEL")
  })

  test('fetch by language iso - logical - OR', async () => {
    const languagesBy = {
      or: [
        {
          iso: {
            value: "TEL"
          }
        },
        {
          description: {
            value: "Hindi"
          }
        }
      ]
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.data.languages.length).toEqual(2)
    expect(res.data.languages.filter(e => e.iso === "TEL")[0].iso).toEqual("TEL")
  })

  test('fetch by language iso - filter - IN', async () => {
    const languagesBy = {
      iso: {
        operation: "IN",
        valueList: ["TEL", "SAN"]
      }
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.data.languages.length).toEqual(2)
  })

  test('fetch by language iso - filter - Regex', async () => {
    const languagesBy = {
      iso: {
        operation: "REGEX",
        value: "^T"
      }
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.data.languages[0].iso.charAt(0)).toEqual("T")
  })

  test('should fail - missing default filter - value', async () => {
    const languagesBy = {
      iso: {
      }
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.errors.length).toBeGreaterThan(0)
  })

  test('should fail - missing filter - value', async () => {
    const languagesBy = {
      iso: {
        operation: "REGEX",
      }
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.errors.length).toBeGreaterThan(0)
  })

  test('should fail - missing filter - valueList', async () => {
    const languagesBy = {
      iso: {
        operation: "IN",
      }
    }
    const res = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(res.errors.length).toBeGreaterThan(0)
  })


  test('should create and delete language', async () => {

    // create language
    const withData = {
      iso: "TST",
      name: "Test",
      description: "Test Language"
    }
    const resCreate = await apolloServer.executeOperation({ query: CREATE_LANGUAGE, variables: { withData } })
    expect(resCreate.data.createdId).toBeDefined()

    // update language
    const updateWithData = {
      description: "Test Lang Descr"
    }
    const resUpdate = await apolloServer.executeOperation({
      query: UPDATE_LANGUAGE,
      variables: { id: resCreate.data.createdId, withData: updateWithData }
    })
    expect(resUpdate.data.updatedId).toEqual(resCreate.data.createdId)

    // read language to validate
    const languagesBy = {
      id: {
        value: resCreate.data.createdId
      }
    }
    const resSearch = await apolloServer.executeOperation({ query: GET_LANGUAGES_BY, variables: { languagesBy } })
    expect(resSearch.data.languages[0].description).toEqual(updateWithData.description)

    // delete above language
    const resDelete = await apolloServer.executeOperation({ query: DELETE_LANGUAGE, variables: { id: resCreate.data.createdId } })
    expect(resDelete.data.deletedId).toEqual(resCreate.data.createdId)
  })

  test('should fail to update language if not exist', async () => {
    const updateWithData = {
      description: "Test Lang Descr"
    }
    const resUpdate = await apolloServer.executeOperation({
      query: UPDATE_LANGUAGE,
      variables: { id: 'randomupdateid', withData: updateWithData }
    })
    expect(resUpdate.errors).toBeDefined()
  })

  test('should fail to delete language if not exist', async () => {
    const resDelete = await apolloServer.executeOperation({ query: DELETE_LANGUAGE, variables: { id: '6152755b9d74594e04aaa67e' } })
    expect(resDelete.errors).toBeDefined()
  })

})