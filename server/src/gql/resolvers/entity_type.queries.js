const { gql } = require( "apollo-server-core" );

const GET_ENTITY_TYPES_BY = gql`
query ($entityTypesBy: EntityTypeSearchInput) {
  entityTypes(by: $entityTypesBy){
    id
    code
    name(language:"ENG")
    description
  }
}
`
const CREATE_ENTITY_TYPE = gql`
mutation ($withData: EntityTypeInput) {
  createdId: createEntityType(withData: $withData)
}
`

const UPDATE_ENTITY_TYPE = gql`
mutation ($id: ID!, $withData: EntityTypeInput){
  updatedId: updateEntityType(id: $id, withData: $withData)
}
`

const DELETE_ENTITY_TYPE = gql`
mutation ($id: ID!){
  deletedId: deleteEntityType(id: $id)
}
`

module.exports = {
  CREATE_ENTITY_TYPE,
  GET_ENTITY_TYPES_BY,
  UPDATE_ENTITY_TYPE,
  DELETE_ENTITY_TYPE,
}