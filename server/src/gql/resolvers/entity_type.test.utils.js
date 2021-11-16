const { CREATE_ENTITY_TYPE, DELETE_ENTITY_TYPE } = require('./entity_type.queries')

async function initEntityTypes({ testData, apolloServer }) {
  const allAsyncs = testData.map(async (withData) =>
    apolloServer.executeOperation({ query: CREATE_ENTITY_TYPE, variables: { withData } }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.createdId)
  // console.log(allIds)
  return allIds
}

async function cleanupEntityTypes({ ids = [], apolloServer }) {
  const allAsyncs = ids.map(async id => apolloServer.executeOperation({
    query: DELETE_ENTITY_TYPE, variables: { id },
  }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.deletedId)
  // console.log(allIds)
  return allIds
}

const testData = {
  createEntityTypes: [
    {
      "code": "GOD",
      "name": "God"
    },
    {
      "code": "AUTHOR",
      "name": "Author"
    },
    {
      "code": "SLOKAM",
      "name": "Slokam"
    },
    {
      "code": "ADHYAAYAM",
      "name": "Adhyaayam"
    },
    {
      "code": "PARVAM",
      "name": "Parvam"
    },
    {
      "code": "KAANDAM",
      "name": "Kaandam"
    },
    {
      "code": "STHOTRAM",
      "name": "Sthotram"
    },
    {
      "code": "DANDAKAM",
      "name": "Dandakam"
    },
    {
      "code": "SARGA",
      "name": "Sarga"
    },
    {
      "code": "PURANAM",
      "name": "Puranam"
    },
    {
      "code": "ITIHASAM",
      "name": "Itihasam"
    },
    {
      "code": "OTHERS",
      "name": "Others"
    }
  ],
}


module.exports = {
  testData,
  initEntityTypes,
  cleanupEntityTypes,
}