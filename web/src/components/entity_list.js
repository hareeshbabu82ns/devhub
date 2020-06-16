import React from 'react'
import { Card, Segment } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import { useQuery, gql } from '@apollo/client';

import {
  useRouteMatch,
} from "react-router-dom";

import settings from '../state/settings'
import { baseTypes } from '../state/base_types'
import EntityCard from './entity_card'

const ENTITIES_BY_TYPE = gql`
query GetEntitiesList($type: ID, $language: ID) {
  entities: entities(by: { type: $type }) {
    id
    defaultText
    textData(language: $language) {
      text
    }
  }
}
`;
const ENTITIES_BY_PARENT_AND_TYPE = gql`
query GetEntityList($parent: ID,$type:ID $language: ID) {
  subEntities: entities(by:{id:$parent}){
    id
    entities:childEntities(by:{type:$type}){
      id
      defaultText
      textData(language:$language){
        id
        text
      }
    }
  }
}
`;

const EntityList = ({ entityId, entityTypeName }) => {
  const match = useRouteMatch();
  console.log(entityTypeName)
  const settingsData = useRecoilValue(settings)
  const { entityTypes } = useRecoilValue(baseTypes)
  const entityTypeId = (entityTypeName || match.params.entityTypeName).split('_')[0]
  const entityType = entityTypes.find((types) => types.id === entityTypeId)
  const variables = {
    type: Number(entityType.id),
    language: Number(settingsData.language)
  }
  if (entityId) {
    variables.parent = Number(entityId)
  }

  const { loading, error, data } = useQuery(
    entityId ? ENTITIES_BY_PARENT_AND_TYPE : ENTITIES_BY_TYPE,
    { variables });

  if (loading) return <Segment loading> Loading Content... </Segment>;
  if (error) return <Segment>Error loading Entity list</Segment>;

  const entities = (entityId) ? data.subEntities[0].entities : data.entities

  return (
    <Card.Group centered>
      {entities.map((entity) =>
        (<EntityCard key={entity.id} data={{
          id: entity.id,
          text: entity.textData[0] ? entity.textData[0].text : entity.defaultText,
          typeId: entityType.id,
          typeName: entityType.name,
        }} />))
      }
    </Card.Group>
  )
}

export default EntityList