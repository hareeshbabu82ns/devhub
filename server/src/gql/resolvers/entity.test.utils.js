const { CREATE_ENTITY, DELETE_ENTITY } = require('./entity.queries')

async function initEntities({ testData, apolloServer }) {
  const allAsyncs = testData.map(async (withData) =>
    apolloServer.executeOperation({ query: CREATE_ENTITY, variables: { withData } }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.createdId)
  // console.log(allIds)
  return allIds
}

async function cleanupEntities({ ids = [], apolloServer }) {
  const allAsyncs = ids.map(async id => apolloServer.executeOperation({
    query: DELETE_ENTITY, variables: { id },
  }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.deletedId)
  // console.log(allIds)
  return allIds
}

const testData = {
  createEntities: [
    {
      type: "GOD",
      text: [
        { language: "SAN", value: "Ganesha San" },
        { language: "ENG", value: "Ganesha Eng" },
        { language: "TEL", value: "Ganesha Tel" },
      ],
    },
    {
      type: "GOD",
      text: [
        { language: "SAN", value: "Govinda San" },
        { language: "ENG", value: "Govinda Eng" },
        { language: "TEL", value: "Govinda Tel" },
      ],
    },
    {
      type: "SLOKAM",
      text: [
        { language: "SAN", value: "Sloka1 San" },
        { language: "ENG", value: "Sloka1 Eng" },
        { language: "TEL", value: "Sloka1 Tel" },
      ],
    },
    {
      type: "SLOKAM",
      text: [
        { language: "SAN", value: "Sloka2 San" },
        { language: "ENG", value: "Sloka2 Eng" },
        { language: "TEL", value: "Sloka2 Tel" },
      ],
    }
  ],
  simple: {
    create: {
      type: "GOD",
      text: [
        { language: "ENG", value: "Simple Test" },
      ],
    },
    update: {
      text: [
        { language: "ENG", value: "Simple Test Chg" },
      ]
    }
  },
  search: {
    byType: {
      type: {
        value: "SLOKAM"
      }
    },
    byAndRegex: {
      and: [
        {
          type: {
            operation: "REGEX",
            value: "^SLO.*"
          }
        },
        {
          text: {
            path: "ENG",
            operation: "REGEX",
            value: ".*Eng$"
          }
        }
      ]
    },
    byOrRegex: {
      or: [
        {
          type: {
            value: "SLOKAM"
          }
        },
        {
          text: {
            path: "ENG",
            value: "Ganesha Eng"
          }
        }
      ]
    },
    byIn: {
      type: {
        operation: "IN",
        valueList: ["GOD", "AUTHOR"]
      }
    },
    byRegex: {
      type: {
        operation: "REGEX",
        value: "^G"
      }
    },
  }
}


module.exports = {
  testData,
  initEntities,
  cleanupEntities,
}