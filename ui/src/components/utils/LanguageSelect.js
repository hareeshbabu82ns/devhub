import { MenuItem, Select } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import { C_LANGUAGE_DEFAULT, C_LANGUAGE_MEANING_DEFAULT } from '../../constants'
import { startTransition } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { baseLanguagesState } from '../../state/baseLanguages'


function LanguageSelect() {
  const [ searchParams, setSearchParams ] = useSearchParams()
  const baseLanguagesLoadable = useRecoilValueLoadable( baseLanguagesState )

  const handleChange = ( { target } ) => {
    // console.log(target)
    searchParams.set( 'language', target.value )
    searchParams.delete( 'languageMeaning' )
    // setSearchParams( searchParams, { replace: true } )
    startTransition( () => setSearchParams( searchParams, { replace: true } ) )
  }

  if ( baseLanguagesLoadable.state === 'loading' ) return null
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
      error={baseLanguagesLoadable.state === 'hasError'}
    >
      {baseLanguagesLoadable.contents.map( c => (
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