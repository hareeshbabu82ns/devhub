import _ from 'lodash'
import React from 'react'
import { Search, List } from 'semantic-ui-react'
import { useLazyQuery, gql } from '@apollo/client';


const resultRenderer = ({ id, title, devanagari }) =>
  <List.Item key={id}>{title}{devanagari ? ' - ' + devanagari : ''}</List.Item>

function SearchDictionaryInput({ maxHits, inDictionary, searchInContent, outputScheme, startsWith, endsWith, onChange }) {

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
          ...data,
          key: data.value, maxHits: Number(data.maxHits),
          fromDictionary: data.inDictionary,
          // searchInContent: data.searchInContent,
          // outputScheme: data.outputScheme
        }
      })
    }, 300)
  }, [])

  React.useEffect(() => {
    // console.log(data)
    if (data && data.keywords)
      setResults(_.uniqBy(data.keywords, 'key').map(item => ({ ...item, 'title': item.key })))
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
        setValue(data.result.key)
        if (onChange)
          onChange(data.result)
      }}
      placeholder={'Search for Keywords'}
      onSearchChange={(e, data) => handleSearchChange(e, {
        value: data.value,
        inDictionary, maxHits, searchInContent,
        outputScheme, startsWith, endsWith,
      })}
      resultRenderer={resultRenderer}
      results={results}
      value={value}
    />
  )
}

export default SearchDictionaryInput

const SEARCH_DICT_BY_KEY = gql`
query SearchDictKeys($fromDictionary:Dictionaries,$key:String!,$searchInContent:Boolean,$maxHits:Int,$outputScheme:SanscriptScheme, $startsWith:Boolean, $endsWith:Boolean) {
  keywords:dictionarySearch(
    searchWith:{
      origin:$fromDictionary
      fuzzySearch:$searchInContent
      limit:$maxHits
      outputScheme:$outputScheme
      startsWith:$startsWith
      endsWith:$endsWith
      search:$key
    }
  ){
    id
    key
  }
}
`;