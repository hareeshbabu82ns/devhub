import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import throttle from 'lodash/throttle'
import { gql, useLazyQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'
import { C_LANGUAGE_DEFAULT } from '../../constants'
import _ from 'lodash'

const QUERY_GET_ENTITIES_BY_TEXT = gql`
  query($text:String,$language:String) {
    entities(
    by: {
      text: { operation: REGEX, path: "value", value: $text }
      type: { operation: NOT_IN, valueList: [SLOKAM] }
    }
  ){
      id
      type
      text(language:$language)
      imageThumbnail
    }
  }
`

export default function AutoCompleteFormInput( { defaultValue, onChange } ) {
  const [ value, setValue ] = React.useState( defaultValue )
  const [ inputValue, setInputValue ] = React.useState( '' )
  const [ options, setOptions ] = React.useState( [] )

  const [ searchParams ] = useSearchParams()
  const [ searchEtitiesByText, { loading: isEntitySearchLoading,
    data: entitySearchData } ] = useLazyQuery( QUERY_GET_ENTITIES_BY_TEXT )

  console.log( defaultValue )

  const fetch = React.useMemo(
    () =>
      throttle( ( request, callback ) => {
        console.log( request )
        searchEtitiesByText( {
          variables: {
            language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT,
            text: `^${request.input}.*`
          }
        } ).then( ( { data } ) => callback( data.entities ) )
      }, 1500 ),
    [ searchEtitiesByText, searchParams ],
  )

  React.useEffect( () => {
    let active = true

    if ( inputValue === '' ) {
      setOptions( value ? [ value ] : [] )
      return undefined
    }

    fetch( { input: inputValue }, ( results ) => {
      if ( active ) {
        let newOptions = []

        if ( value ) {
          newOptions = [ value ]
        }

        if ( results ) {
          newOptions = [ ...newOptions, ...results ]
        }

        setOptions( newOptions )
      }
    } )

    return () => {
      active = false
    }
  }, [ value, inputValue, fetch ] )

  return (
    <Autocomplete
      id="google-map-demo"
      size='small'
      multiple
      getOptionLabel={( option ) => {
        // console.log( 'getOptionLabel: ', option )
        return ( typeof option === 'string' ? option : option.text ) || ''
      }}
      filterOptions={( x ) => x}
      options={options}
      autoComplete
      // includeInputInList
      // filterSelectedOptions
      isOptionEqualToValue={( option, value ) => {
        // console.log( 'isOptionEqualToValue: ', option, value )
        return !!_.find( option, { id: value.id } )
        // return false
      }}
      value={value}
      onChange={( event, newValue ) => {
        // console.log( 'onChange: ', newValue )
        setOptions( newValue ? [ newValue, ...options ] : options )
        setValue( newValue )
        onChange( newValue )
      }}
      onInputChange={( event, newInputValue ) => {
        setInputValue( newInputValue )
      }}
      renderInput={( params ) => (
        <TextField {...params} label="Add a location" fullWidth />
      )}
      renderOption={( props, option ) => {
        // console.log( option )
        return (
          <li {...props} key={option.id}>
            <Grid container alignItems="center">
              <Grid item>
                <Box
                  component={LocationOnIcon}
                  sx={{ color: 'text.secondary', mr: 2 }}
                />
              </Grid>
              <Grid item xs>
                {option.text}
                <Typography variant="body2" color="text.secondary">
                  {option.type}
                </Typography>
              </Grid>
            </Grid>
          </li>
        )
      }}
    />
  )
}
