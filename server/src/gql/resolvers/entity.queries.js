const { gql } = require("apollo-server-core");

const GET_ENTITIES_BY = gql`
query ($entitiesBy: EntitySearchInput) {
  entities(by: $entitiesBy){
    id
    type
    text(language:"ENG")
  }
}
`

const CREATE_ENTITY = gql`
mutation ($withData: EntityInput) {
  createdId: createEntity(withData: $withData)
}
`

const UPDATE_ENTITY = gql`
mutation ($id: ID!, $withData: EntityInput){
  updatedId: updateEntity(id: $id, withData: $withData)
}
`

const DELETE_ENTITY = gql`
mutation ($id: ID!){
  deletedId: deleteEntity(id: $id)
}
`


module.exports = {
  CREATE_ENTITY,
  GET_ENTITIES_BY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
}