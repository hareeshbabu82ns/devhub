import React, { useState } from 'react'
import { Menu, Segment, Form, Divider, Table } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import { useForm, Controller } from "react-hook-form";
import { useLazyQuery, gql } from '@apollo/client';
import ReactMarkdown from 'react-markdown'
import * as _ from 'lodash'

import SearchDictionaryInput from './SearchDictionaryInput'
import settings from '../../state/settings'

const SaDictionaries = () => {
  const settingsData = useRecoilValue(settings)

  const [showigSearchView, showSearchView] = useState(true)

  const options = [
    { key: 'all', text: 'All', value: 'ALL' },
    { key: 'vcp', text: 'Vacaspatyam (San->San)', value: 'SAN_SAN_VACASPATYAM' },
    { key: 'skd', text: 'Sabda Kalpadarum (San->San)', value: 'SAN_SAN_SABDA_KALPADRUMA' },
    { key: 'mw', text: 'Monier Williams 1899 (San->Eng)', value: 'SAN_ENG_MONIER_WILLIAMS_1899' },
    { key: 'mwe', text: 'Monier Williams (Eng->San)', value: 'ENG_SAN_MONIER_WILLIAMS' },
  ]

  const { fontSize, inverted } = useRecoilValue(settings)

  const [searchDictMeanings, { loading, error, data, refetch }] = useLazyQuery(SEARCH_DICT_MEANINGS);

  const defaultValues = {
    fromDDLB: 'ALL', maxHits: 10, key: '', keys: '', meanings: '',
    fuzzySearch: false, resultsInDevanagari: false
  }

  const { handleSubmit, control, errors, reset, formState, setValue, getValues, watch } = useForm({
    defaultValues
  })

  React.useEffect(() => {
    if (error)
      showSearchView(true)
    if (data && data.meanings) {
      showSearchView(data.meanings.length == 0)
    }
  }, [data, error])


  const onSubmit = async (data) => {
    if (!showigSearchView) {
      showSearchView(!showigSearchView)
      return
    }
    console.log('searching for meanings')
    const keys = data['keys'].split(',')
    searchDictMeanings({
      variables: {
        ...data,
        asDevanagari: resultsInDevanagari,
        fromDictionary: fromDDLB,
        keys, maxHits: Number(data.maxHits)
      }
    })
  }

  // const { fromDDLB, maxHits, fuzzySearch } = getValues()
  const { fromDDLB, maxHits, fuzzySearch, resultsInDevanagari } = watch(["fromDDLB", "maxHits", "fuzzySearch", "resultsInDevanagari"])
  // console.log('watch data:', fromDDLB, maxHits, fuzzySearch, resultsInDevanagari)

  const validations = {
    keys: { required: { value: true, message: 'Search Keys are Required' } },
    maxHits: { required: { value: true, message: 'Max Search Results is Required' } },
  }

  return (
    <div style={{ margin: "0 0.5em" }}>
      <Menu color={'teal'} inverted={settingsData.inverted} attached={'top'}>
        <Menu.Item as='h4' header>
          Dictionaries
      </Menu.Item>
        <Menu.Menu position='right'>
          {refetch && <Menu.Item icon='refresh' onClick={() => refetch({
            asDevanagari: resultsInDevanagari,
            fromDictionary: fromDDLB, maxHits: Number(data.maxHits)
          })} />}
          <Menu.Item icon='search'
            active={showigSearchView}
            onClick={() => showSearchView(!showigSearchView)} />
        </Menu.Menu>
      </Menu>
      <Segment attached inverted={settingsData.inverted} >
        <Form onSubmit={handleSubmit(onSubmit)} inverted={settingsData.inverted}
          style={{ display: showigSearchView ? 'block' : 'none' }}>
          <Form.Group widths={'equal'} >
            <Form.Field width={7}>
              <Controller as={Form.Select} control={control}
                name="fromDDLB" rules={validations.fromDDLB} error={errors.fromDDLB && errors.fromDDLB.message}
                fluid label='From Dictionary' placeholder='From Dictionary'
                options={options}
                onChange={([_, { value }]) => value}
              />
            </Form.Field>
            <Form.Field fluid>
              <label>Search for Keywords</label>
              <SearchDictionaryInput inDictionary={fromDDLB} maxHits={maxHits}
                searchInContent={fuzzySearch} asDevanagari={resultsInDevanagari}
                onChange={({ title }) => searchDictMeanings({
                  variables: {
                    maxHits: Number(maxHits),
                    asDevanagari: resultsInDevanagari,
                    fromDictionary: fromDDLB, keys: [title]
                  }
                })} />
            </Form.Field>
            <Form.Field width={5}>
              <label>&nbsp;</label>
              <Controller as={Form.Checkbox} control={control} name="fuzzySearch"
                rules={validations.fuzzySearch} error={errors.fuzzySearch && errors.fuzzySearch.message}
                label='Fuzzy Search' onChange={([_, { checked }]) => checked} />
              <Controller as={Form.Checkbox} control={control} name="resultsInDevanagari"
                rules={validations.resultsInDevanagari} error={errors.resultsInDevanagari && errors.resultsInDevanagari.message}
                label='Devanagari' onChange={([_, { checked }]) => checked} />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={4}>
              <label>Max Results:</label>
              <Controller as={Form.Input} control={control} name="maxHits"
                rules={validations.maxHits} error={errors.maxHits && errors.maxHits.message}
                placeholder='Max Hits' type="number" />
            </Form.Field>
            <Form.Field width={12}>
              <label>Fetch Meanings: ("," seperated for multiple)</label>
              <Controller as={Form.TextArea} control={control} name="keys" style={{ fontSize: '1.5em' }}
                rules={validations.keys} error={errors.keys && errors.keys.message} loading={loading}
                placeholder='Fetch Meanings: ("," seperated for multiple)' rows={3} />
            </Form.Field>
          </Form.Group>
          <Divider horizontal inverted={settingsData.inverted}>
            <Form.Group unstackable>
              <Form.Button type='submit' inverted color={'orange'} loading={loading}
                icon={'paper plane outline'} content={showigSearchView ? 'Fetch Meanings' : 'Edit Search'} />
            </Form.Group>
          </Divider>
        </Form>
      </Segment>
      {loading && <Segment attached loading={loading} ></Segment>}
      {data &&
        <Table attached striped size='large' inverted={inverted}>
          <Table.Body style={{ fontSize: `${fontSize}em` }}>
            {data.meanings.map(meaning => {
              console.log(meaning)
              return (
                <Table.Row key={meaning.id} id={meaning.id} >
                  <Table.Cell>
                    <ReactMarkdown className='ReactMarkdown__content--default'
                      source={_.get(meaning, 'content')} escapeHtml={true} />
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      }
    </div>
  )
}
export default SaDictionaries

const SEARCH_DICT_MEANINGS = gql`
query SearchDictMeanings($fromDictionary:Dictionaries,$keys:[String!]!,$maxHits:Int, $asDevanagari:Boolean) {
  meanings:  dictionaryMeanings(
    inDictionary:$fromDictionary
    maxHits: $maxHits
    asDevanagari: $asDevanagari
    keys:$keys
  ){
    id
    key
    content
  }
}
`;