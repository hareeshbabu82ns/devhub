const { CREATE_ENTITY_TYPE, DELETE_ENTITY_TYPE } = require( './entity_type.queries' )

async function initEntityTypes( { testData, apolloServer } ) {
  const allAsyncs = testData.map( async ( withData ) =>
    apolloServer.executeOperation( { query: CREATE_ENTITY_TYPE, variables: { withData } } ) )
  const allIds = ( await Promise.all( allAsyncs ) ).map( res => res.data.createdId )
  // console.log(allIds)
  return allIds
}

async function cleanupEntityTypes( { ids = [], apolloServer } ) {
  const allAsyncs = ids.map( async id => apolloServer.executeOperation( {
    query: DELETE_ENTITY_TYPE, variables: { id },
  } ) )
  const allIds = ( await Promise.all( allAsyncs ) ).map( res => res.data.deletedId )
  // console.log(allIds)
  return allIds
}

const testData = {
  createEntityTypes: [
    {
      "code": "GOD",
      name: [
        { language: "SAN", value: "God San" },
        { language: "ENG", value: "God Eng" },
        { language: "TEL", value: "God Tel" },
      ],
    },
    {
      "code": "AUTHOR",
      name: [
        { language: "SAN", value: "Author San" },
        { language: "ENG", value: "Author Eng" },
        { language: "TEL", value: "Author Tel" },
      ],
    },
    {
      "code": "SLOKAM",
      name: [
        { language: "SAN", value: "Slokam San" },
        { language: "ENG", value: "Slokam Eng" },
        { language: "TEL", value: "Slokam Tel" },
      ],
    },
    {
      "code": "ADHYAAYAM",
      name: [
        { language: "SAN", value: "Adhyaayam San" },
        { language: "ENG", value: "Adhyaayam Eng" },
        { language: "TEL", value: "Adhyaayam Tel" },
      ],
    },
    {
      "code": "PARVAM",
      name: [
        { language: "SAN", value: "Parvam San" },
        { language: "ENG", value: "Parvam Eng" },
        { language: "TEL", value: "Parvam Tel" },
      ],
    },
    {
      "code": "KAANDAM",
      name: [
        { language: "SAN", value: "Kaandam San" },
        { language: "ENG", value: "Kaandam Eng" },
        { language: "TEL", value: "Kaandam Tel" },
      ],
    },
    {
      "code": "STHOTRAM",
      name: [
        { language: "SAN", value: "Sthotram San" },
        { language: "ENG", value: "Sthotram Eng" },
        { language: "TEL", value: "Sthotram Tel" },
      ],
    },
    {
      "code": "DANDAKAM",
      name: [
        { language: "SAN", value: "Dandakam San" },
        { language: "ENG", value: "Dandakam Eng" },
        { language: "TEL", value: "Dandakam Tel" },
      ],
    },
    {
      "code": "SARGA",
      name: [
        { language: "SAN", value: "Sarga San" },
        { language: "ENG", value: "Sarga Eng" },
        { language: "TEL", value: "Sarga Tel" },
      ],
    },
    {
      "code": "PURANAM",
      name: [
        { language: "SAN", value: "Puranam San" },
        { language: "ENG", value: "Puranam Eng" },
        { language: "TEL", value: "Puranam Tel" },
      ],
    },
    {
      "code": "ITIHASAM",
      name: [
        { language: "SAN", value: "Itihasam San" },
        { language: "ENG", value: "Itihasam Eng" },
        { language: "TEL", value: "Itihasam Tel" },
      ],
    },
    {
      "code": "OTHERS",
      name: [
        { language: "SAN", value: "Others San" },
        { language: "ENG", value: "Others Eng" },
        { language: "TEL", value: "Others Tel" },
      ],
    }
  ],
  transliteration: {
    input: {
      "code": "GOD",
      name: [
        { language: "SAN", value: "$transliterateFrom=SLP1" },
        { language: "SLP1", value: "Siva" },
        { language: "TEL", value: "$transliterateFrom=SLP1" },
      ],
    },
    output: {
      "code": "GOD",
      name: [
        // { language: "SAN", value: "శివ" },
        { language: "SLP1", value: "Siva" },
        { language: "TEL", value: "శివ" },
      ],
    }
  },
}


module.exports = {
  testData,
  initEntityTypes,
  cleanupEntityTypes,
}