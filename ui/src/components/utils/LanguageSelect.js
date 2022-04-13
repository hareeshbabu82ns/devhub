import { MenuItem, Select } from '@mui/material';
import { gql, useQuery } from "@apollo/client"
import { useSearchParams } from 'react-router-dom';
import { C_LANGUAGE_DEFAULT, C_LANGUAGE_MEANING_DEFAULT } from '../../constants';

export const GET_LANGUAGES_NAMES = gql`
{
  languages{
    id
    iso
    name
  }
}
`

function LanguageSelect() {
  const { data, loading, error } = useQuery( GET_LANGUAGES_NAMES )
  const [ searchParams, setSearchParams ] = useSearchParams();

  const handleChange = ( { target } ) => {
    // console.log(target)
    searchParams.set( 'language', target.value )
    searchParams.delete( 'languageMeaning' )
    setSearchParams( searchParams, { replace: true } )
  }

  if ( loading ) return null
  // const defaultEnv = data?.configs?.find(c => c.default) || {}
  // if (searchParams.get('language') === '' && defaultEnv?.name)
  //   setSearchParams({ 'language': defaultEnv.name })

  return (
    <Select
      size="small"
      sx={{ minWidth: '100px', mr: 1 }}
      labelId="language-label"
      id="language"
      value={searchParams.get( 'language' ) || ''}
      label="Language"
      autoWidth
      onChange={handleChange}
      error={!!error}
    >
      {data?.languages.map( c => (
        <MenuItem key={c.iso} value={c.iso}>{c.name}</MenuItem>
      ) )}
    </Select>
  )
}

export const getLanguageParams = ( { searchParams } ) => {
  const lang = searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT
  const langMeaning = searchParams.get( 'languageMeaning' ) || C_LANGUAGE_MEANING_DEFAULT

  const paramsObject = { language: lang }

  // console.log( `lang: ${lang}` )
  if ( lang ) {
    // console.log( `langMeaning: ${langMeaning}` )
    if ( langMeaning ) {
      paramsObject[ 'languageMeaning' ] = langMeaning
    }
  }

  const paramsString = `language=${lang}&languageMeaning=${langMeaning}`
  return { paramsObject, paramsString }
}

export default LanguageSelect