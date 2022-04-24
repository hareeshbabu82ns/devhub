const axios = require( 'axios' )

const sanscriptUtilsAPI = axios.create( {
  baseURL: process.env.SANSCRIPT_UTILS_URL,
  timeout: 5000,
  headers: { 'X-Sanscript-Client': 'DevHubJS' }
} )

module.exports = {

  dictionarySearch: async ( { searchWith }, requestedFields ) => {
    const query = `
      query search($searchWith: DictionarySearchInput!){
        dictionarySearch(searchWith:$searchWith){
          ${requestedFields.join( ' ' )}
        }
      }
    `
    const res = await sanscriptUtilsAPI.post( '', { query, variables: { searchWith } } )
    // console.log( res?.data )
    return res?.data?.data?.dictionarySearch
  },

  dictionarySearchById: async ( { id, outputScheme }, requestedFields ) => {
    const query = `
      query search($id: ID!, $outputScheme: SanscriptScheme){
        dictionarySearchById(id:$id, outputScheme:$outputScheme){
          ${requestedFields.join( ' ' )}
        }
      }
    `
    const res = await sanscriptUtilsAPI.post( '', { query, variables: { id, outputScheme } } )
    // console.log( res?.data )
    return res?.data?.data?.dictionarySearchById
  },

  splits: async ( { text, schemeFrom, schemeTo, strictIO, limit } ) => {
    const query = `
      query splits($text: String!, $schemeFrom: SanscriptScheme, 
                  $schemeTo: SanscriptScheme, $strictIO: Boolean, $limit: Int){
        splits(text:$text, schemeFrom:$schemeFrom, 
          schemeTo: $schemeTo, strictIO: $strictIO, limit: $limit)
      }
    `
    const res = await sanscriptUtilsAPI.post( '', { query, variables: { text, schemeFrom, schemeTo, strictIO, limit } } )
    return res?.data?.data?.splits
  },

  joins: async ( { words, schemeFrom, schemeTo, strictIO } ) => {
    const query = `
      query joins($words: [String!]!, $schemeFrom: SanscriptScheme, 
                  $schemeTo: SanscriptScheme, $strictIO: Boolean){
        joins(words:$words, schemeFrom:$schemeFrom, 
          schemeTo: $schemeTo, strictIO: $strictIO)
      }
    `
    const res = await sanscriptUtilsAPI.post( '', { query, variables: { words, schemeFrom, schemeTo, strictIO } } )
    return res?.data?.data?.joins
  },

  transliterate: async ( { text, schemeFrom, schemeTo } ) => {
    const query = `
      query transliterate($text: String!, $schemeFrom: SanscriptScheme, 
                  $schemeTo: SanscriptScheme){
        transliterate(text:$text, schemeFrom:$schemeFrom, schemeTo: $schemeTo)
      }
    `
    const res = await sanscriptUtilsAPI.post( '', { query, variables: { text, schemeFrom, schemeTo } } )
    return res?.data?.data?.transliterate
  },

}