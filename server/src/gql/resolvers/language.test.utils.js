const { CREATE_LANGUAGE, DELETE_LANGUAGE } = require('./language.queries')

async function initLanguages({ testData, apolloServer }) {
  const allAsyncs = testData.map(async (withData) =>
    apolloServer.executeOperation({ query: CREATE_LANGUAGE, variables: { withData } }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.createdId)
  // console.log(allIds)
  return allIds
}

async function cleanupLanguages({ ids = [], apolloServer }) {
  const allAsyncs = ids.map(async id => apolloServer.executeOperation({
    query: DELETE_LANGUAGE, variables: { id },
  }))
  const allIds = (await Promise.all(allAsyncs)).map(res => res.data.deletedId)
  // console.log(allIds)
  return allIds
}

const testData = {
  createLanguages: [
    {
      "iso": "SAN",
      "name": "संस्कृतम्",
      "description": "Sanskrit"
    },
    {
      "iso": "TEL",
      "name": "తెలుగు",
      "description": "Telugu"
    },
    {
      "iso": "ENG",
      "name": "English",
      "description": "English"
    },
    {
      "iso": "TAM",
      "name": "தமிழ்",
      "description": "Tamil"
    },
    {
      "iso": "IAST",
      "name": "IAST",
      "description": "International Alphabet of Sanskrit Transliteration"
    },
    {
      "iso": "SLP1",
      "name": "SLP1",
      "description": "Sanskrit Library Phonetic Basic"
    },
    {
      "iso": "HIN",
      "name": "हिन्दि",
      "description": "Hindi"
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
    byAnd: {
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
    byOr: {
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
  },
  createWithChildren: {
    simple: {
      type: "GOD",
      text: [
        { language: "SAN", value: "GOD with Children San" },
        { language: "ENG", value: "GOD with Children Eng" },
        { language: "TEL", value: "GOD with Children Tel" },
      ],
      children: [
        {
          type: "PURANAM",
          text: [
            { language: "SAN", value: "simple1 San" },
            { language: "ENG", value: "simple1 Eng" },
            { language: "TEL", value: "simple1 Tel" },
          ],
        },
        {
          type: "SLOKAM",
          text: [
            { language: "SAN", value: "simple1 Sloka1 San" },
            { language: "ENG", value: "simple1 Sloka1 Eng" },
            { language: "TEL", value: "simple1 Sloka1 Tel" },
          ],
        },
      ],
    }
  }
}


module.exports = {
  testData,
  initLanguages,
  cleanupLanguages,
}