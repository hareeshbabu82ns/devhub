const { expect, test } = require("@jest/globals");
const mongoose = require("mongoose");
const buildApolloServer = require("../apollo_server")
const { testData, initUsers, cleanupUsers } = require('./user.test.utils')
const { GET_CURRENT_USER } = require('./user.queries')

describe('GQL - User Tests', () => {

  let apolloServer
  const createdIds = []

  beforeAll(async () => {
    apolloServer = await buildApolloServer({ debug: false })
    const ids = await initUsers({ apolloServer, testData: testData.createUsers })
    createdIds.push(...ids)
  })


  afterAll(async () => {
    const ids = await cleanupUsers({ apolloServer, ids: createdIds })
    const finalIds = createdIds.filter(id => !ids.includes(id))
    expect(finalIds.length).toEqual(0)
    return mongoose.disconnect()
  })

  test('fetch current user', async () => {
    const res = await apolloServer.executeOperation({ query: GET_CURRENT_USER })
    expect(res.data.me.displayName).toEqual("Admin")
  })

})