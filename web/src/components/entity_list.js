import React from 'react'
import { Card, Segment, Menu, Container } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import { useQuery, gql } from '@apollo/client';
import _ from 'lodash'

import {
  useRouteMatch,
  useHistory,
} from "react-router-dom";

import settings from '../state/settings'
import { baseTypes } from '../state/base_types'
import EntityCard from './entity_card'

const ENTITIES_BY_TYPE = gql`
query GetEntitiesList($type: ID, $language: ID) {
  entities: entities(by: { type: $type }) {
    id
    defaultText
    defaultThumbnail
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
    defaultText
    defaultThumbnail
    entities:childEntities(by:{type:$type}){
      id
      defaultText
      defaultThumbnail
      textData(language:$language){
        id
        text
      }
    }
  }
}
`;

const EntityList = ({ entityId, entityTypeName }) => {
  const match = useRouteMatch()
  const history = useHistory()
  // console.log(entityTypeName)
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

  const { loading, error, data, refetch } = useQuery(
    entityId ? ENTITIES_BY_PARENT_AND_TYPE : ENTITIES_BY_TYPE,
    { variables });

  if (loading) return <Segment loading placeholder> Loading Content... </Segment>;
  if (error) return <Segment placeholder>Error loading Entity list</Segment>;

  const entities = entityId ? data.subEntities[0].entities : data.entities
  const title = entityType.name

  return (
    <Container fluid style={{ padding: '0 1em' }}>
      <Menu attached='top' inverted={settingsData.inverted}>
        <Menu.Item>
          <Menu.Header content={title}></Menu.Header>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item icon='refresh' onClick={() => refetch()} />
          <Menu.Item icon='add'
            onClick={() => history.push(
              match.url + `?operation=createEntity` +
              `&parentEntity=${entityId ? entityId : ''}&createType=${entityType.id}`)} />
        </Menu.Menu>
      </Menu>
      <Segment attached='bottom' inverted={settingsData.inverted}>
        <Card.Group centered doubling>
          {entities.map((entity) =>
            (<EntityCard key={entity.id} data={{
              id: entity.id,
              text: !_.isEmpty(_.get(entity.textData[0], 'text')) ? entity.textData[0].text : entity.defaultText,
              typeId: entityType.id,
              typeName: entityType.name,
              parentEntity: entityId,
              defaultThumbnail: entity.defaultThumbnail
            }} />))
          }
        </Card.Group>
      </Segment>
    </Container>
  )
}

export default EntityList