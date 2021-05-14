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
    { key: 'vcp', text: 'Vacaspatyam (San->San)', value: 'VCP' },
    { key: 'dp', text: 'Dhatu Pata', value: 'DHATU_PATA' },
    { key: 'skd', text: 'Sabda Kalpadarum (San->San)', value: 'SKD' },
    { key: 'mw', text: 'Monier Williams 1899 (San->Eng)', value: 'MW' },
    { key: 'mwe', text: 'Monier Williams (Eng->San)', value: 'MWE' },
  ]

  const schemeOptions = [
    { key: 'devanagari', text: 'Devanagari', value: 'DEVANAGARI' },
    { key: 'iast', text: 'IAST', value: 'IAST' }, //'International Alphabet of Sanskrit Transliteration'
    { key: 'slp1', text: 'SLP1', value: 'SLP1' }, //'Sanskrit Library Phonetic Basic'
    { key: 'tamil', text: 'Tamil', value: 'TAMIL' },
    { key: 'telugu', text: 'Telugu', value: 'TELUGU' },
    { key: 'itrans', text: 'ITRANS', value: 'ITRANS' },
    // { key: 'hk', text: 'Harvard-Kyoto', value: 'HK' },
    // { key: 'wx', text: 'WX', value: 'WD' },
  ]

  const { fontSize, inverted } = useRecoilValue(settings)

  const [searchDictMeanings, { loading, error, data, refetch }] = useLazyQuery(SEARCH_DICT_MEANINGS);

  const defaultValues = {
    fromDDLB: 'ALL', maxHits: 10, key: '', keys: '', meanings: '',
    fuzzySearch: false, outputScheme: false,
    inputScheme: 'SLP1', outputScheme: 'TELUGU',
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
        outputScheme,
        fuzzySearch,
        fromDictionary: fromDDLB === 'ALL' ? null : fromDDLB,
        keys: keys[0],
        maxHits: Number(data.maxHits)
      }
    })
  }

  // const { fromDDLB, maxHits, fuzzySearch } = getValues()
  const { fromDDLB, maxHits, fuzzySearch, outputScheme, inputScheme, startsWith, endsWith } = watch(["fromDDLB", "maxHits", "fuzzySearch", "outputScheme", "inputScheme", "startsWith", "endsWith"])
  // console.log('watch data:', fromDDLB, maxHits, fuzzySearch, outputScheme)

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
            outputScheme,
            fromDictionary: fromDDLB === 'ALL' ? null : fromDDLB,
            maxHits: Number(data.maxHits)
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
              <SearchDictionaryInput
                inDictionary={fromDDLB === 'ALL' ? null : fromDDLB}
                maxHits={maxHits}
                outputScheme={outputScheme}
                inputScheme={inputScheme}
                startsWith={startsWith} endsWith={endsWith}
                searchInContent={fuzzySearch} asDevanagari={outputScheme}
                onChange={({ title }) => searchDictMeanings({
                  variables: {
                    maxHits: Number(maxHits),
                    inputScheme: outputScheme,
                    outputScheme,
                    fuzzySearch,
                    fromDictionary: fromDDLB === 'ALL' ? null : fromDDLB,
                    keys: title
                  }
                })} />
            </Form.Field>
            <Form.Field width={5} inline>
              <Controller as={Form.Checkbox} control={control} name="fuzzySearch"
                rules={validations.fuzzySearch} error={errors.fuzzySearch && errors.fuzzySearch.message}
                label='Fuzzy Search' onChange={([_, { checked }]) => checked} />
              <Controller as={Form.Checkbox} control={control} name="startsWith"
                rules={validations.startsWith} error={errors.startsWith && errors.startsWith.message}
                label='Starts With' onChange={([_, { checked }]) => checked} />
              <Controller as={Form.Checkbox} control={control} name="endsWith"
                rules={validations.endsWith} error={errors.endsWith && errors.endsWith.message}
                label='Ends With' onChange={([_, { checked }]) => checked} />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width={4}>
              <Controller as={Form.Select} control={control}
                name="inputScheme" rules={validations.inputScheme} error={errors.inputScheme && errors.inputScheme.message}
                fluid label='Input Scheme' placeholder='Input Scheme'
                options={schemeOptions}
                onChange={([_, { value }]) => value}
              />
            </Form.Field>
            <Form.Field width={4}>
              <Controller as={Form.Select} control={control}
                name="outputScheme" rules={validations.outputScheme} error={errors.outputScheme && errors.outputScheme.message}
                fluid label='Output Scheme' placeholder='Output Scheme'
                options={schemeOptions}
                onChange={([_, { value }]) => value}
              />
            </Form.Field>
            <Form.Field width={4}>
              <label>Max Results:</label>
              <Controller as={Form.Input} control={control} name="maxHits"
                rules={validations.maxHits} error={errors.maxHits && errors.maxHits.message}
                placeholder='Max Hits' type="number" />
            </Form.Field>
          </Form.Group>
          {/*
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
          */}
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
              // console.log(meaning)
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
query SearchDictMeanings($fromDictionary:Dictionaries,$keys:String!,$maxHits:Int, $inputScheme:SanscriptScheme, $outputScheme:SanscriptScheme,$fuzzySearch:Boolean) {
  meanings:  dictionarySearch(
    searchWith: {
      origin:$fromDictionary
      limit: $maxHits
      fuzzySearch:$fuzzySearch
      searchScheme: $inputScheme
      outputScheme: $outputScheme
      startsWith: true
      endsWith: true
      # searchOnlyKeys: true
      search:$keys
    }
  ){
    id
    key
    content
  }
}
`;