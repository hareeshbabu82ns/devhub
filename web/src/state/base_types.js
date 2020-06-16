import { gql } from '@apollo/client'
import { atom } from 'recoil'
import client from './gql_client'

const FETCH_BASE_TYPES = gql`
query {
  entityTypes{
    id
    name
    description
  }
  languages{
    id
    iso
    description
  }  
}
`;

const baseTypesQuery = async () => {
  const response = await client.query({
    query: FETCH_BASE_TYPES
  })
  if (response.error) {
    throw response.error;
  }
  if (response.data) {
    return { ...response.data }
  }
}

const baseTypes = atom({
  key: 'baseTypes',
  default: { entityTypes: [], languages: [] }
})

export { baseTypes, baseTypesQuery }