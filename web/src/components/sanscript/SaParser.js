import React, { useState } from 'react'
import { t as translate, schemes } from '@sanskrit-coders/sanscript'
import { Menu, Segment, Form, Divider, Table, Placeholder, Message } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import { useForm, Controller } from "react-hook-form";
import { useLazyQuery, gql } from '@apollo/client';
import { toast } from 'react-toastify'

import * as _ from 'lodash'

import settings from '../../state/settings'

const SaParser = () => {

  const { fontSize, inverted } = useRecoilValue(settings)
  // Sample Sentence: द्वितीयकक्ष्यायान्द्वेबालिकेत्रयोबालकाश्चपठन्ति
  // Sample Sandhi: trayas,bAlakAs
  const defaultValues = {
    actionsDDLB: 'splits', content: '',
    maxPaths: 10, resultsInDevanagari: false,
  }

  const { handleSubmit, control, errors, reset, formState, setValue, getValues } = useForm({
    defaultValues
  })

  const { actionsDDLB } = getValues()

  const [performSandhi, { loading: loadingSandhi,
    error: errorSandhi, data: dataSandhi }] = useLazyQuery(PERFORM_SA_SANDHI);
  const [performSplits, { loading: loadingSplits,
    error: errorSplits, data: dataSplits }] = useLazyQuery(PERFORM_SA_SPLITS);

  const onSubmit = async (data) => {
    console.log('performing action')
    if (data.actionsDDLB == 'splits') {
      performSplits({
        variables: {
          ...data,
          maxPaths: Number(data.maxPaths), asDevanagari: data.resultsInDevanagari
        }
      })
    } else if (data.actionsDDLB == 'joins') {
      performSandhi({ variables: { ...data, asDevanagari: data.resultsInDevanagari, splits: data.content.split(',') } })
    }
    showSearchView(false)
  }

  const validations = {
    content: { required: { value: true, message: 'From Language Text Required' } },
    actionsDDLB: { required: true },
    maxPaths: { required: { value: true, message: 'Max Split Paths is Required' } },
  }

  const optionsActions = [
    { key: 'splits', text: 'Split Verses', value: 'splits' },
    { key: 'joins', text: 'Join Words', value: 'joins' },
  ]

  const [showigSearchView, showSearchView] = useState(true)

  React.useEffect(() => {
    if (errorSandhi || errorSplits) {
      showSearchView(true)
      toast(<Message error header='Error processing Input' />)
    }
    if (dataSandhi && dataSandhi.joins) {
      showSearchView(dataSandhi.joins.length == 0)
      if (actionsDDLB == 'joins' && dataSandhi.joins.length == 0)
        toast(<Message warning header='No Sandhis derived for Input' />)
    }
    if (dataSplits && dataSplits.splits) {
      showSearchView(dataSplits.splits.length == 0)
      if (actionsDDLB == 'splits' && dataSplits.splits.length == 0)
        toast(<Message warning header='No Splits derived for Input' />)
    }
  }, [dataSandhi, errorSandhi, dataSplits, errorSplits])

  return (
    <div style={{ margin: "0 0.5em" }}>
      <Menu color={'teal'} inverted={inverted} attached={'top'}>
        <Menu.Item as='h4' header>
          Sanskrit Parser
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item icon='search'
            active={showigSearchView}
            onClick={() => showSearchView(!showigSearchView)} />
        </Menu.Menu>
      </Menu>
      <Segment attached inverted={inverted} >
        <Form onSubmit={handleSubmit(onSubmit)} inverted={inverted}
          style={{ display: showigSearchView ? 'block' : 'none' }}>
          <Form.Group widths={'equal'} >
            <Form.Field width={7}>
              <Controller as={Form.Select} control={control}
                name="actionsDDLB" rules={validations.actionsDDLB} error={errors.actionsDDLB && errors.actionsDDLB.message}
                fluid label='Actions' placeholder='Actions'
                options={optionsActions}
                onChange={([_, { value }]) => value}
              />
            </Form.Field>
            <Form.Field width={4}>
              <label>Max Paths:</label>
              <Controller as={Form.Input} control={control} name="maxPaths"
                rules={validations.maxPaths} error={errors.maxPaths && errors.maxPaths.message}
                placeholder='Max Paths' type="number" />
            </Form.Field>
            <Form.Field width={3}>
              <label>&nbsp;</label>
              <Controller as={Form.Checkbox} control={control} name="resultsInDevanagari"
                rules={validations.resultsInDevanagari} error={errors.resultsInDevanagari && errors.resultsInDevanagari.message}
                label='Devanagari' onChange={([_, { checked }]) => checked} />
            </Form.Field>
          </Form.Group>
          <Form.Group >
            <Controller as={Form.TextArea} control={control} name="content" style={{ fontSize: '1.5em' }}
              rules={validations.content} error={errors.content && errors.content.message}
              placeholder='From' width={16} rows={5} />
          </Form.Group>
          <Divider horizontal inverted={inverted}>
            <Form.Group unstackable>
              <Form.Button type='submit' inverted color={'orange'}
                icon={'paper plane outline'} content={'Process'} />
            </Form.Group>
          </Divider>
        </Form>
      </Segment>
      {(loadingSplits || loadingSandhi) && <Segment attached inverted={inverted} >
        <Placeholder inverted={inverted} fluid><Placeholder.Line /><Placeholder.Line /></Placeholder>
      </Segment>}
      {(actionsDDLB == 'splits' && dataSplits && dataSplits.splits) &&
        <SplitsView data={dataSplits.splits} inverted={inverted} fontSize={fontSize} />}
      {(actionsDDLB == 'joins' && dataSandhi && dataSandhi.joins) &&
        <JoinsView data={dataSandhi.joins} inverted={inverted} fontSize={fontSize} />}
    </div>
  )
}
export default SaParser

const SplitsView = ({ data, inverted, fontSize }) => {
  return (
    <Segment attached inverted={inverted} style={{ overflowX: 'scroll', padding: '0px' }} basic>
      <Table attached striped size='large' inverted={inverted}>
        <Table.Body style={{ fontSize: `${fontSize}em` }}>
          {data.map(splits => (
            <Table.Row key={splits} id={splits} >
              {splits.map(split => (
                <Table.Cell>
                  {split}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  )
}
const JoinsView = ({ data, inverted, fontSize }) => {
  return (
    <Segment attached inverted={inverted} style={{ overflowX: 'scroll', padding: '0px' }} basic>
      <Table attached striped size='large' inverted={inverted}>
        <Table.Body style={{ fontSize: `${fontSize}em` }}>
          {data.map(joins => (
            <Table.Row key={joins} id={joins} >
              <Table.Cell>
                {joins}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Segment>
  )
}
const PERFORM_SA_SANDHI = gql`
query sanskritSandhi($asDevanagari:Boolean,$splits:[String!]!) {
  joins:  sanskritSandhi(
    asDevanagari:$asDevanagari
    splits:$splits
  )
}
`;

const PERFORM_SA_SPLITS = gql`
query sanskritSplits($asDevanagari:Boolean,$content:String!,$maxPaths:Int) {
  splits:  sanskritSplits(
    asDevanagari:$asDevanagari
    maxPaths: $maxPaths
    content:$content
  )
}
`;