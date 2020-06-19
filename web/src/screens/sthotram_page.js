/*
  SthotramPage (TODOs)
    show child Slokas -> Content
    provide show/hide for Meanings
    M
*/

import React from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import ReactMarkdown from 'react-markdown'

import {
  Container,
  Segment,
  Menu,
  Table
} from 'semantic-ui-react'
import { gql, useQuery } from '@apollo/client'
import {
  useRouteMatch,
} from "react-router-dom";
import _ from 'lodash'

import settings from '../state/settings'
import { C_ENTITY_TYPE_STOTRAM } from '../utils/constants'
import { baseTypes } from '../state/base_types'
import EntityList from '../components/entity_list'

const SthotramPage = () => {
  const match = useRouteMatch();

  const { language, fontSize } = useRecoilValue(settings)
  const setSetting = useSetRecoilState(settings)
  const { entityTypes } = useRecoilValue(baseTypes)
  const entityType = entityTypes.find((types) => types.name === C_ENTITY_TYPE_STOTRAM)

  const updateFontSize = (by) => {
    const newFontSize = fontSize + by
    if (newFontSize < 1) return
    setSetting(oldSetting => ({ ...oldSetting, fontSize: oldSetting.fontSize + by }))
  }

  const variables = {
    stotramId: Number(match.params.stotramId),
    language: Number(language)
  }

  const { loading, error, data } = useQuery(FETCH_STOTRAM_CONTENT, { variables });

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
          <Menu.Item icon='add' />
        </Menu.Menu>
      </Menu>
      <Table attached striped size='large'>
        <Table.Body style={{ fontSize: `${fontSize}em` }}>
          {stotram.slokas.map(slokam => (
            <Table.Row key={slokam.id} >
              <Table.Cell>
                <ReactMarkdown source={slokam.content[0].content} escapeHtml={false} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  )
}

// const SlokamCard = ({ slokam }) => {
//   return (

//   )
// }

const FETCH_STOTRAM_CONTENT = gql`
query GetStotramContents($stotramId:ID,$language:ID!){
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
    }
  }
}
`;

export default SthotramPage