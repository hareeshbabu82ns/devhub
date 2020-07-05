import React from 'react'
import { Card, Segment, Menu, Container, Message } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import { useQuery, useMutation, gql } from '@apollo/client';
import { toast } from 'react-toastify'
import _ from 'lodash'

import {
  useRouteMatch,
  useHistory,
} from "react-router-dom";

import settings from '../state/settings'
import { baseTypes } from '../state/base_types'
import BookmarkCard from './bookmark_card'



const BookmarkList = () => {
  const match = useRouteMatch()
  const history = useHistory()
  // console.log(entityTypeName)
  const settingsData = useRecoilValue(settings)
  const { entityTypes } = useRecoilValue(baseTypes)

  const [deleteBookmark, { data: deletedMookmark }] = useMutation(DELETE_BOOKMARK)

  const { loading, error, data, refetch } = useQuery(BOOKMARKS_LIST);

  if (loading) return <Segment loading placeholder> Loading Content... </Segment>;
  if (error) return <Segment placeholder>Error loading Bookmarks list</Segment>;

  const bookmarks = data.bookmarks

  const onDeleteClicked = async (id) => {
    try {
      await deleteBookmark({ variables: { id } })
      toast(<Message success header='Bookmark deleted' />)
      refetch()
    } catch (e) {
      toast(<Message success header='Error deleting Bookmark' />)
    }
  }

  return (
    <div fluid style={{ padding: '0 0.5em' }}>
      <Menu attached='top' inverted={settingsData.inverted}>
        <Menu.Item>
          <Menu.Header content='Bookmarks'></Menu.Header>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item icon='refresh' onClick={() => refetch()} />
        </Menu.Menu>
      </Menu>
      <Segment attached='bottom' inverted={settingsData.inverted}>
        <Card.Group centered doubling>
          {bookmarks.map((entity) =>
            (<BookmarkCard key={entity.id} data={{
              id: entity.id,
              entityId: entity.entity.id,
              text: _.get(entity, 'entity.defaultText'),
              typeName: entity.entity.type.name,
              parentId: _.get(entity, 'entity.parents[0].id'),
              parentTypeName: _.get(entity, 'entity.parents[0].type.name'),
              onDeleteClicked,
            }} />))
          }
        </Card.Group>
      </Segment>
    </div>
  )
}

export default BookmarkList

const DELETE_BOOKMARK = gql`
mutation DeleteBookmark($id:ID!){
  deleteBookmark(id:$id)
}
`;
const BOOKMARKS_LIST = gql`
query GetBookmarksList {
  bookmarks{
    id
    url
    entity{
      id
      defaultText
      type{
        name
      }
      parents:parentEntities{
        id
        defaultText
        type{
          name
        }
        grandParents:parentEntities{
          id
          defaultText
          type{
            name
          }
        }
      }
    }
  }
}
`;