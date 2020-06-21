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
  Divider
} from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'
import {
  useRouteMatch,
  useHistory,
} from "react-router-dom";
import _ from 'lodash'

import settings from '../state/settings'
import { C_ENTITY_TYPE_STOTRAM, C_ENTITY_TYPE_SLOKAM } from '../utils/constants'
import { baseTypes } from '../state/base_types'
import EntityList from '../components/entity_list'

const SthotramPage = () => {
  const history = useHistory()
  const match = useRouteMatch()
  const entityId = match.params.stotramId
  const [showMeanings, toggleMeanings] = useState(false)

  const { language, meaningLanguage, fontSize } = useRecoilValue(settings)
  const setSetting = useSetRecoilState(settings)
  const { entityTypes } = useRecoilValue(baseTypes)
  const entityType = entityTypes.find((types) => types.name === C_ENTITY_TYPE_SLOKAM)

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
      <Menu color={'blue'} inverted attached={'top'}>
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
      <Table attached striped size='large'>
        <Table.Body style={{ fontSize: `${fontSize}em` }}>
          {stotram.slokas.map(slokam => (
            <Table.Row key={slokam.id} >
              <Table.Cell>
                <ReactMarkdown source={_.get(slokam, 'content[0].content',
                  `**${slokam.defaultText}** has **no content**`)} escapeHtml={false} />
                {showMeanings &&
                  <div style={{ marginLeft: '0.5em', borderLeft: '1px solid blue', paddingLeft: '0.5em' }}>
                    <ReactMarkdown source={_.get(slokam, 'contentMeaning[0].content', '**no meaning**')} escapeHtml={false} />
                  </div>
                }
              </Table.Cell>
              <Table.Cell textAlign='right'>
                <Button.Group size='mini' basic>
                  <Button icon='edit' onClick={() => history.push(
                    match.url + `?operation=createContent&parentEntity=${entityId}` +
                    `&entityId=${slokam.id}&createType=${entityType.id}`)} />
                </Button.Group>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

const FETCH_STOTRAM_CONTENT = gql`
query GetStotramContents($stotramId:ID,$language:ID!,$meaningLanguage:ID!){
  stotram:entities(by:{id:$stotramId}){
    id
    defaultText
    textData(language:$language){
      id
      text
    }
    slokas:childEntities(by:{type:3}){
      id
      defaultText
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