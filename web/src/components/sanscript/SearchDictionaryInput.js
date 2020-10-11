import _ from 'lodash'
import React from 'react'
import { Search, List } from 'semantic-ui-react'
import { useLazyQuery, gql } from '@apollo/client';


const resultRenderer = ({ title, devanagari }) => <List.Item>{title}{devanagari ? ' - ' + devanagari : ''}</List.Item>

function SearchDictionaryInput({ maxHits, inDictionary, searchInContent, asDevanagari, onChange }) {

  const [value, setValue] = React.useState('')
  const [results, setResults] = React.useState([])

  const [searchDict, { loading, error, data }] = useLazyQuery(SEARCH_DICT_BY_KEY);

  const timeoutRef = React.useRef()
  const handleSearchChange = React.useCallback((e, data) => {
    clearTimeout(timeoutRef.current)
    setValue(data.value)
    // console.log(e.target.value, data.value)

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        setResults([])
        setValue('')
        return
      }
      searchDict({
        variables: {
          key: data.value, maxHits: Number(data.maxHits),
          fromDictionary: data.inDictionary,
          searchInContent: data.searchInContent,
          asDevanagari: data.asDevanagari
        }
      })
    }, 300)
  }, [])

  React.useEffect(() => {
    console.log(data)
    if (data && data.keywords)
      setResults(data.keywords.map(item => ({ ...item, 'title': item.id })))
    else
      setResults([])
  }, [data])

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [])
  return (
    <Search
      style={{ borderRadius: '5rem' }}
      loading={loading}
      onResultSelect={(e, data) => {
        setValue(data.result.id)
        if (onChange)
          onChange(data.result)
      }}
      placeholder={'Search for Keywords'}
      onSearchChange={(e, data) => handleSearchChange(e, {
        value: data.value,
        inDictionary, maxHits, searchInContent, asDevanagari
      })}
      resultRenderer={resultRenderer}
      results={results}
      value={value}
    />
  )
}

export default SearchDictionaryInput

const SEARCH_DICT_BY_KEY = gql`
query SearchDictKeys($fromDictionary:Dictionaries,$key:String!,$searchInContent:Boolean,$maxHits:Int,$asDevanagari:Boolean) {
  keywords:dictionaryKeySearch(
    inDictionary:$fromDictionary
    searchContent:$searchInContent
    maxHits:$maxHits
    asDevanagari:$asDevanagari
    key:$key
  ){
    id
    devanagari
  }
}
`;