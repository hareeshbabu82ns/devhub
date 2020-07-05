/*
  SingleChildPage (TODOs)
    show child Item -> Content
    provide show/hide for Meanings
*/

import React, { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import ReactMarkdown from 'react-markdown'

import {
  Container,
  Segment,
  Menu,
  Table,
  Button,
  Message,
  Label,
} from 'semantic-ui-react'
import { gql, useQuery, useMutation } from '@apollo/client'
import {
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { toast } from 'react-toastify'
import _ from 'lodash'

import settings from '../state/settings'
import { C_ENTITY_TYPE_SLOKAM } from '../utils/constants'
import { baseTypes } from '../state/base_types'

const SingleChildContentPage = () => {
  const history = useHistory()
  const match = useRouteMatch()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const markedItem = params.get('markedItem')
  const entityId = match.params.entityId
  const [showMeanings, toggleMeanings] = useState(false)

  const { language, meaningLanguage, fontSize, inverted } = useRecoilValue(settings)
  const setSetting = useSetRecoilState(settings)
  const { entityTypes } = useRecoilValue(baseTypes)
  const entityType = entityTypes.find((types) => types.name === C_ENTITY_TYPE_SLOKAM)

  const [updateBookmark, { data: updatedBookmark }] = useMutation(UPDATE_BOOKMARK)

  const onAddBookmarkClicked = async (withData) => {
    try {
      await updateBookmark({ variables: { withData } })
      toast(<Message success header='Bookmark Added' />)
    } catch (e) {
      toast(<Message success header='Error adding Bookmark (probably already exist?)' />)
    }
  }

  const updateFontSize = (by) => {
    const newFontSize = fontSize + by
    if (newFontSize < 1) return
    setSetting(oldSetting => ({ ...oldSetting, fontSize: oldSetting.fontSize + by }))
  }

  const variables = {
    entityId: Number(match.params.entityId),
    language: Number(language),
    meaningLanguage: Number(meaningLanguage)
  }

  const { loading, error, data, refetch } = useQuery(FETCH_ENTITY_CONTENT, { variables });

  if (loading) return <Segment loading> Loading Content... </Segment>;
  if (error) return <Segment>Error loading Base Data</Segment>;

  const entity = data.entities[0]
  return (
    <div style={{ padding: '0 0.5em' }}>
      <Menu color={'blue'} inverted={inverted} attached={'top'}>
        <Menu.Item as='h4' header>
          {!_.isEmpty(_.get(entity.textData[0], 'text')) ? entity.textData[0].text : entity.defaultText}
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item onClick={() => updateFontSize(-0.5)} >A-</Menu.Item>
          <Menu.Item onClick={() => updateFontSize(0.5)} >A+</Menu.Item>
          <Menu.Item onClick={() => refetch()} icon='refresh' ></Menu.Item>
          <Menu.Item onClick={() => toggleMeanings((curr) => !curr)}
            icon='book' active={showMeanings} ></Menu.Item>
          <Menu.Item icon='add'
            onClick={() => history.push(
              match.url + `?operation=createContent&parentEntity=${entityId}` +
              `&createType=${entityType.id}`)} />
        </Menu.Menu>
      </Menu>
      <Table attached striped size='large' inverted={inverted}>
        <Table.Body style={{ fontSize: `${fontSize}em` }}>
          {entity.childEntities.map(slokam => (
            <Table.Row key={slokam.id} id={slokam.id} positive={slokam.id === markedItem} >
              <Table.Cell>
                <Button.Group size='mini' basic inverted={inverted} floated="right">
                  <Button icon='edit' onClick={() => history.push(
                    match.url + `?operation=createContent&parentEntity=${entityId}` +
                    `&entityId=${slokam.id}&createType=${entityType.id}`)} />
                  <Button icon='bookmark' onClick={() => onAddBookmarkClicked({ entity: slokam.id })} />
                </Button.Group>
                <ReactMarkdown className='ReactMarkdown__content--default'
                  source={_.get(slokam, 'content[0].content',
                    `**${slokam.defaultText}** has **no content**`)} escapeHtml={true} />
                {showMeanings &&
                  <ReactMarkdown className='ReactMarkdown__meaning--default'
                    source={_.get(slokam, 'contentMeaning[0].content', '**no meaning**')} escapeHtml={true} />
                }
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
const UPDATE_BOOKMARK = gql`
mutation UpdateBookmark($withData:BookmarkUpdateInput!){
  updateBookmark(withData:$withData){
    id
  }
}
`;
const FETCH_ENTITY_CONTENT = gql`
query GetEntityContents($entityId:ID,$language:ID!,$meaningLanguage:ID!){
  entities(by:{id:$entityId}){
    id
    defaultText
    defaultThumbnail
    textData(language:$language){
      id
      text
    }
    childEntities(by:{hasContentInLanguage:$language}){
      id
      defaultText
      defaultThumbnail
      type{
        id
        name
      }
      textData(language:$language){
        id
        text
      }
      content(language:$language){
        id
        content
      }
      contentMeaning(language:$meaningLanguage){
        id
        content
      }
    }
  }
}
`;

export default SingleChildContentPage