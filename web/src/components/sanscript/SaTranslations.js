import React, { useState } from 'react'
import { t as translate, schemes } from '@sanskrit-coders/sanscript'
import { Menu, Segment, Form, Divider, Header, Grid, Button } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import { useForm, Controller } from "react-hook-form";

import {
  useRouteMatch,
} from "react-router-dom";

import * as _ from 'lodash'

import { mapSchemes } from './utils'
import settings from '../../state/settings'

const SaTranslations = () => {
  let match = useRouteMatch();
  const settingsData = useRecoilValue(settings)

  const options = [
    { key: 'devanagari', text: 'Devanagari', value: 'devanagari' },
    { key: 'iast', text: 'IAST', value: 'iast' }, //'International Alphabet of Sanskrit Transliteration'
    { key: 'slp1', text: 'SLP1', value: 'slp1' }, //'Sanskrit Library Phonetic Basic'
    { key: 'tamil', text: 'Tamil', value: 'tamil' },
    { key: 'telugu', text: 'Telugu', value: 'telugu' },
    { key: 'itrans', text: 'ITRANS', value: 'itrans' },
    { key: 'hk', text: 'Harvard-Kyoto', value: 'hk' },
    { key: 'wx', text: 'WX', value: 'wx' },
  ]

  const defaultValues = { fromDDLB: 'devanagari', toDDLB: 'iast', from: 'संस्कृतम्', to: '' } // संस्कृतम्

  let [schemesMap, setSchemesMap] = useState(mapSchemes(defaultValues.fromDDLB, defaultValues.toDDLB))

  const { handleSubmit, control, errors, reset, formState, setValue, getValues } = useForm({
    defaultValues
  })
  const onSubmit = async (data) => {
    console.log('converting From -> To')
    performTranslation(getValues())
  }

  const performTranslation = (values) => {
    const translatedValue = translate(values.from, values.fromDDLB, values.toDDLB)
    setValue('to', translatedValue)
    setSchemesMap(mapSchemes(values.fromDDLB, values.toDDLB))
  }

  const onSwitch = () => {
    console.log('switching From <-> To')
    const values = getValues()
    setValue([{ fromDDLB: values.toDDLB }, { from: values.to }, { toDDLB: values.fromDDLB }, { to: values.from }])
    setSchemesMap(mapSchemes(values.toDDLB, values.fromDDLB))
  }

  const validations = {
    from: { required: { value: true, message: 'From Language Text Required' } },
    fromDDLB: { required: true },
    toDDLB: { required: true },
  }

  return (
    <div style={{ marginRight: "2em" }}>
      <Menu color={'teal'} inverted={settingsData.inverted} attached={'top'}>
        <Menu.Item as='h4' header>
          Translations
      </Menu.Item>
      </Menu>
      <Segment attached inverted={settingsData.inverted} >
        <Form onSubmit={handleSubmit(onSubmit)} inverted={settingsData.inverted}>
          <Form.Group >
            <Controller as={Form.Select} control={control}
              name="fromDDLB" rules={validations.fromDDLB} error={errors.fromDDLB && errors.fromDDLB.message}
              fluid width={4} label='From' placeholder='From'
              options={options}
              onChange={([_, { value }]) => value}
            />
            <Controller as={Form.TextArea} control={control} name="from" style={{ fontSize: '1.5em' }}
              rules={validations.from} error={errors.from && errors.from.message}
              placeholder='From' width={12} rows={5} />
          </Form.Group>
          <Divider horizontal inverted={settingsData.inverted}>
            <Form.Group unstackable>
              <Form.Button type='button' inverted color={'blue'}
                icon={'sync alternate'} content={'Switch'}
                onClick={onSwitch}
              />
              <Form.Button type='submit' inverted color={'orange'}
                icon={'paper plane outline'} content={'Convert'} />
            </Form.Group>
          </Divider>
          <Form.Group>
            <Controller as={Form.Select} control={control}
              name='toDDLB' rules={validations.toDDLB} error={errors.toDDLB && errors.toDDLB.message}
              fluid width={4} label='To' placeholder='To'
              options={options}
              onChange={([_, { value }]) => { performTranslation({ ...getValues(), toDDLB: value }); return value }}
            />
            <Controller as={Form.TextArea} control={control} name="to" style={{ fontSize: '1.5em' }}
              placeholder='To' width={12} rows={5} />
          </Form.Group>
        </Form>
        <React.Fragment>
          <Header color={'teal'} inverted={settingsData.inverted}
            attached='top'>Scheme Mapping</Header>
          <Segment attached inverted={settingsData.inverted}>
            {Object.keys(schemesMap).map((segment, index) => (
              <React.Fragment key={index}>
                <Header as='h4' color={'blue'}>{segment}</Header>
                <Grid container columns='10' doubling>
                  {_.isArray(schemesMap[segment]) && schemesMap[segment].map((element, index) =>
                    (<Grid.Column key={index}>
                      <Button
                        basic compact
                        inverted={settingsData.inverted}
                        content={element[1]}
                        label={{ basic: true, content: element[0] }}
                        labelPosition='left'
                        onClick={() => { setValue('from', getValues().from + element[0]) }}
                      />
                    </Grid.Column>))}
                </Grid>
              </React.Fragment>
            ))}
          </Segment>
        </React.Fragment>
      </Segment>
    </div>
  )
}
export default SaTranslations