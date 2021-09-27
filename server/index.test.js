const { expect, test } = require("@jest/globals");
const { gql } = require("apollo-server-core");
const mongoose = require("mongoose");
const buildApolloServer = require("./src/gql/apollo_server")

describe('Apollo Server Connectivity Test', () => {

  let apolloServer

  beforeAll(async () => {
    apolloServer = await buildApolloServer()
  })

  test('server should be initialized', () => {
    expect(apolloServer).toBeDefined()
  })

  test('version query should work', async () => {
    const GET_VERSION = gql`{version}`
    const res = await apolloServer.executeOperation({ query: GET_VERSION })
    expect(res).toHaveProperty('data')
    expect(res.data).toMatchObject({ version: "v1" })
  })

  afterAll(() => {
    return mongoose.disconnect()
  })


})