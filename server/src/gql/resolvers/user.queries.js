const { gql } = require("apollo-server-core");

const GET_CURRENT_USER = gql`
query {
  me {
    displayName
  }
}
`

const GET_USERS_BY = gql`
query ($usersBy: UserSearchInput) {
  users(by: $usersBy){
    displayName
    settings
  }
}
`
const CREATE_USER = gql`
mutation ($withData: UserInput) {
  createdId: createUser(withData: $withData)
}
`

const UPDATE_USER = gql`
mutation ($id: ID!, $withData: UserInput){
  updatedId: updateUser(id: $id, withData: $withData)
}
`

const DELETE_USER = gql`
mutation ($id: ID!){
  deletedId: deleteUser(id: $id)
}
`

module.exports = {
  CREATE_USER,
  GET_USERS_BY,
  UPDATE_USER,
  DELETE_USER,
  GET_CURRENT_USER,
}