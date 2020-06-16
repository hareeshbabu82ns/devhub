/*
  AuthorsPage (TODOs)
    Authors list with images
    small descrioption of the Author
    available items for the Author
*/

import React from 'react'
import { useRecoilValue } from 'recoil'

import { C_ENTITY_TYPE_AUTHOR } from '../utils/constants'
import { baseTypes } from '../state/base_types'
import EntityList from '../components/entity_list'


const AuthorsPage = () => {
  const { entityTypes } = useRecoilValue(baseTypes)
  const entityType = entityTypes.find((types) => types.name === C_ENTITY_TYPE_AUTHOR)
  return (<EntityList entityTypeName={`${entityType.id}_${entityType.name}`} />)
}

export default AuthorsPage