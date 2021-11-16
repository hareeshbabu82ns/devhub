const { gql } = require("apollo-server-core");

const GET_LANGUAGES_BY = gql`
query ($languagesBy: LanguageSearchInput) {
  languages(by: $languagesBy){
    iso
    name
    description
  }
}
`
const CREATE_LANGUAGE = gql`
mutation ($withData: LanguageInput) {
  createdId: createLanguage(withData: $withData)
}
`

const UPDATE_LANGUAGE = gql`
mutation ($id: ID!, $withData: LanguageInput){
  updatedId: updateLanguage(id: $id, withData: $withData)
}
`

const DELETE_LANGUAGE = gql`
mutation ($id: ID!){
  deletedId: deleteLanguage(id: $id)
}
`

module.exports = {
  CREATE_LANGUAGE,
  GET_LANGUAGES_BY,
  UPDATE_LANGUAGE,
  DELETE_LANGUAGE,
}