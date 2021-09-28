const { expect, test } = require("@jest/globals");
const { gql } = require("apollo-server-core");
const mongoose = require("mongoose");
const buildApolloServer = require("../apollo_server")

const GET_CURRENT_USER = gql`
query {
  me {
    displayName
  }
}
`

describe('GQL - User Test', () => {

  let apolloServer

  beforeAll(async () => {
    apolloServer = await buildApolloServer()
  })

  afterAll(() => {
    return mongoose.disconnect()
  })

  test('fetch current user', async () => {
    const res = await apolloServer.executeOperation({ query: GET_CURRENT_USER })
    expect(res.data.me.displayName).toEqual("Admin")
  })

})