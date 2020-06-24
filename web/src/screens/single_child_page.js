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

const SingleChildContentPage = () => {
  const history = useHistory()
  const match = useRouteMatch()
  const entityId = match.params.entityId
  const [showMeanings, toggleMeanings] = useState(false)

  const { language, meaningLanguage, fontSize, inverted } = useRecoilValue(settings)
  const setSetting = useSetRecoilState(settings)
  const { entityTypes } = useRecoilValue(baseTypes)
  const entityType = entityTypes.find((types) => types.name === C_ENTITY_TYPE_SLOKAM)

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

  const { loading, error, data, refetch } = useQuery(FETCH_STOTRAM_CONTENT, { variables });

  if (loading) return <Segment loading> Loading Content... </Segment>;
  if (error) return <Segment>Error loading Base Data</Segment>;

  const entity = data.entities[0]
  return (
    <Container fluid style={{ padding: '0 2em' }}>
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
            <Table.Row key={slokam.id} >
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
query GetStotramContents($entityId:ID,$language:ID!,$meaningLanguage:ID!){
  entities(by:{id:$entityId}){
    id
    defaultText
    defaultThumbnail
    textData(language:$language){
      id
      text
    }
    childEntities{
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