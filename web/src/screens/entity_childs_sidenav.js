import React, { useEffect } from 'react'
import { Menu, Segment, Dropdown } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import {
  Link,
  useRouteMatch,
  useLocation,
  useHistory,
} from "react-router-dom";

import { useQuery, gql } from '@apollo/client';

import settings from '../state/settings'
import { baseTypes } from '../state/base_types'

const ENTITY_CHILD_TYPES = gql`
query GetEntityChildrenByType($id: ID) {
  entities(by:{id:$id}){
    id
    defaultText
    defaultThumbnail
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
  const history = useHistory()
  const childItemType = location.pathname.replace(match.url, '').split('/')[1]
  const childItemTypeName = (childItemType) ? childItemType.split('_')[1] : ''
  const settingsData = useRecoilValue(settings)
  const { entityTypes } = useRecoilValue(baseTypes)

  const { loading, error, data, refetch } = useQuery(ENTITY_CHILD_TYPES,
    { variables: { id: Number(entityId), language: Number(settingsData.language) } });

  useEffect(() => {
    if (data && data.entities && data.entities[0].childTypes.length == 1) {
      // console.log('data changed')
      const type = data.entities[0].childTypes[0]
      history.replace(`${match.url}/${type.id}_${type.name}`)
    }
    // data.entities[0].childTypes
  }, [data])

  if (loading) return <Segment loading placeholder> Loading Content... </Segment>;
  if (error) return <Segment placeholder>Error loading Child Types list</Segment>;

  const title = data.entities[0].defaultText

  // console.log(match, location, childItemType)
  return (
    <React.Fragment>
      <Menu attached='top' fluid borderless inverted={settingsData.inverted} color='blue'>
        <Menu.Item>
          <Menu.Header as='h4' content={title} />
        </Menu.Item>
        <Menu.Menu position='right' >
          <Dropdown item icon='add'>
            <Dropdown.Menu>
              {
                entityTypes.map(entityType => (
                  <Dropdown.Item key={entityType.id} onClick={() => history.push(
                    match.url + `?operation=createEntity` +
                    `&parentEntity=${entityId ? entityId : ''}&createType=${entityType.id}`)}
                  >{entityType.name}</Dropdown.Item>
                ))
              }
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item icon='refresh' onClick={() => refetch()} />
        </Menu.Menu>
      </Menu>
      <Menu vertical fluid attached='bottom' inverted={settingsData.inverted}>
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
    </React.Fragment>
  )
}

export default EntityChildNavbar