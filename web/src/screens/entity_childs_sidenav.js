import React from 'react'
import { Menu, Segment, Sticky } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import {
  Link,
  useRouteMatch,
  useLocation,
} from "react-router-dom";

import { useQuery, gql } from '@apollo/client';

import settings from '../state/settings'

const ENTITY_CHILD_TYPES = gql`
query GetEntityChildrenByType($id: ID) {
  entities(by:{id:$id}){
    id
    defaultText
    childTypes{
      id
      name
    }
  }
}
`;

const EntityChildNavbar = ({ entityId }) => {
  const match = useRouteMatch()
  const location = useLocation()
  const childItemType = location.pathname.replace(match.url, '').split('/')[1]
  const childItemTypeName = (childItemType) ? childItemType.split('_')[1] : ''
  const settingsData = useRecoilValue(settings)

  const { loading, error, data } = useQuery(ENTITY_CHILD_TYPES,
    { variables: { id: Number(entityId), language: Number(settingsData.language) } });

  if (loading) return <Segment loading placeholder> Loading Content... </Segment>;
  if (error) return <Segment placeholder>Error loading Child Types list</Segment>;

  const title = data.entities[0].defaultText

  // console.log(match, location, childItemType)
  return (
    <Menu vertical fluid>
      <Menu.Item><Menu.Header content={title} /></Menu.Item>
      {
        //  <Menu.Item>
        //     <Input icon='search' placeholder='Search items...' />
        //   </Menu.Item>
      }

      {
        data.entities[0].childTypes.map((type) => (
          <Menu.Item
            key={type.id}
            active={type.name === childItemTypeName}
            name={type.name} as={Link}
            to={`${match.url}/${type.id}_${type.name}`}
          >
            {type.name}
          </Menu.Item>
        ))
      }
    </Menu>
  )
}

export default EntityChildNavbar