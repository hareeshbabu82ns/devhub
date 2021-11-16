const { GET_CURRENT_USER, CREATE_USER, DELETE_USER } = require('./user.queries')

async function initUsers({ testData, apolloServer }) {
  const allAsyncs = testData.map(async (withData) =>
    apolloServer.executeOperation({ query: CREATE_USER, variables: { withData } }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.createdId)
  // console.log(allIds)
  return allIds
}

async function cleanupUsers({ ids = [], apolloServer }) {
  const allAsyncs = ids.map(async id => apolloServer.executeOperation({
    query: DELETE_USER, variables: { id },
  }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.deletedId)
  // console.log(allIds)
  return allIds
}

const testData = {
  createUsers: [
    {
      // id: "0",
      displayName: "Admin",
      settings: "{displayLang='SAN', meaningLang='TEL'}",
    },
  ],
}


module.exports = {
  testData,
  initUsers,
  cleanupUsers,
}