/*
  SthotramPage (TODOs)
    show child Slokas -> Content
    provide show/hide for Meanings
    M
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

const SthotramPage = () => {
  const history = useHistory()
  const match = useRouteMatch()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const markedItem = params.get('markedItem')
  const entityId = match.params.stotramId
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
    stotramId: Number(match.params.stotramId),
    language: Number(language),
    meaningLanguage: Number(meaningLanguage)
  }

  const { loading, error, data, refetch } = useQuery(FETCH_STOTRAM_CONTENT, { variables });

  if (loading) return <Segment loading> Loading Content... </Segment>;
  if (error) return <Segment>Error loading Base Data</Segment>;

  const stotram = data.stotram[0]
  return (
    <Container fluid style={{ padding: '0 2em' }}>
      <Menu color={'blue'} inverted={inverted} attached={'top'}>
        <Menu.Item as='h4' header>
          {!_.isEmpty(_.get(stotram.textData[0], 'text')) ? stotram.textData[0].text : stotram.defaultText}
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
          {stotram.slokas.map(slokam => (
            <Table.Row key={slokam.id} id={slokam.id} positive={slokam.id === markedItem}>
              <Table.Cell>
                <ReactMarkdown className='ReactMarkdown__content--default'
                  source={_.get(slokam, 'content[0].content',
                    `**${slokam.defaultText}** has **no content**`)} escapeHtml={true} />
                {showMeanings &&
                  <ReactMarkdown className='ReactMarkdown__meaning--default'
                    source={_.get(slokam, 'contentMeaning[0].content', '**no meaning**')} escapeHtml={true} />
                }
              </Table.Cell>
              <Table.Cell textAlign='right'>
                <Button.Group size='mini' basic inverted={inverted}>
                  <Button icon='edit' onClick={() => history.push(
                    match.url + `?operation=createContent&parentEntity=${entityId}` +
                    `&entityId=${slokam.id}&createType=${entityType.id}`)} />
                  <Button icon='bookmark' onClick={() => { onAddBookmarkClicked({ entity: slokam.id }) }} />
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

const UPDATE_BOOKMARK = gql`
mutation UpdateBookmark($withData:BookmarkUpdateInput!){
  updateBookmark(withData:$withData){
    id
  }
}
`;
const FETCH_STOTRAM_CONTENT = gql`
query GetStotramContents($stotramId:ID,$language:ID!,$meaningLanguage:ID!){
  stotram:entities(by:{id:$stotramId}){
    id
    defaultText
    defaultThumbnail
    textData(language:$language){
      id
      text
    }
    slokas:childEntities(by:{type:3, hasContentInLanguage:$language}){
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

export default SthotramPage