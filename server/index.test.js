const { expect, test } = require("@jest/globals");
const { gql } = require("apollo-server-core");
const mongoose = require("mongoose");
const buildApolloServer = require("./src/gql/apollo_server")
const { cleanupCollections } = require('./index.test.utils')

const GET_VERSION = gql`{version}`
const MUTATION_INIT = gql`mutation {init}`

describe('Apollo Server Connectivity Tests', () => {

  let apolloServer

  beforeAll(async () => {
    apolloServer = await buildApolloServer({ debug: false })
  })

  test('server should be initialized', () => {
    expect(apolloServer).toBeDefined()
  })

  test('version query should work', async () => {
    const res = await apolloServer.executeOperation({ query: GET_VERSION })
    expect(res).toHaveProperty('data')
    expect(res.data).toMatchObject({ version: "v1" })
  })

  test('should init database', async () => {
    await cleanupCollections()
    const res = await apolloServer.executeOperation({ query: MUTATION_INIT })
    expect(res.data.init.split(' ')).toContain('initialized')
  })

  afterAll(async () => {
    await cleanupCollections()
    return mongoose.disconnect()
  })


})