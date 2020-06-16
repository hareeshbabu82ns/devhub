/*
  GodsPage (TODOs)
    Gods list with images
    small descrioption of the God
    available items for the God
*/

import React from 'react'
import { useRecoilValue } from 'recoil'

import { C_ENTITY_TYPE_GOD } from '../utils/constants'
import { baseTypes } from '../state/base_types'
import EntityList from '../components/entity_list'

const GodsPage = () => {
  const { entityTypes } = useRecoilValue(baseTypes)
  const entityType = entityTypes.find((types) => types.name === C_ENTITY_TYPE_GOD)
  return (<EntityList entityTypeName={`${entityType.id}_${entityType.name}`} />)
}

export default GodsPage