import { Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material"
import Panel from "../components/utils/Panel"
import CloseIcon from '@mui/icons-material/Close'
import React, { useEffect, useMemo, useState } from "react"
import { throttle } from "lodash"
import { C_SANSCRIPT_SCHEME_MAP } from "../constants"
import { useRecoilState } from "recoil"
import { sanscriptSplitsState } from "../state/sanscriptSplits"
import { gql } from "@apollo/client"
import client from '../utils/GqlClient'

const QUERY_SANSCRIPT_SPLITS = gql`
  query splits($text: String!,$schemeFrom: SanscriptScheme, $schemeTo: SanscriptScheme, 
      $strictIO: Boolean, $limit: Int){
    res:splits(text: $text,schemeFrom: $schemeFrom, schemeTo: $schemeTo, 
      strictIO: $strictIO, limit: $limit)
  }
`
const QUERY_SANSCRIPT_JOINS = gql`
  query joins($words: [String!]!,$schemeFrom: SanscriptScheme, $schemeTo: SanscriptScheme, 
      $strictIO: Boolean){
    res:joins(words: $words,schemeFrom: $schemeFrom, schemeTo: $schemeTo, 
      strictIO: $strictIO)
  }
`

const SanscriptSplitsPage = ( { onClose } ) => {


  const [ ssplits, setSansSplits ] = useRecoilState( sanscriptSplitsState )

  const [ splitsOrJoins, setSplitsOrJoins ] = useState( ssplits.splitsOrJoins )
  const [ inputText, setInputText ] = useState( ssplits.inputText )
  const [ limit, setLimit ] = useState( ssplits.limit )
  const [ strictIO, setStrictIO ] = useState( ssplits.strictIO )
  const [ inputScheme, setInputScheme ] = useState( ssplits.inputScheme )
  const [ outputScheme, setOutputScheme ] = useState( ssplits.outputScheme )

  const [ splitResult, setSplitsResult ] = useState( [] )

  const splitSearch = useMemo(
    () =>
      throttle( ( { inputText, inputScheme, outputScheme,
        limit, strictIO }, callback ) => {
        if ( !inputText ) {
          callback( { inputText, data: [] } )
          return
        }
        const variables = {
          schemeFrom: inputScheme,
          schemeTo: outputScheme,
          strictIO,
        }
        if ( splitsOrJoins === 'splits' ) {
          variables.text = inputText
          variables.limit = Number( limit )
        }
        if ( splitsOrJoins === 'joins' ) {
          variables.words = inputText.split( ',' )
        }

        client.query( {
          query: splitsOrJoins === 'splits' ? QUERY_SANSCRIPT_SPLITS : QUERY_SANSCRIPT_JOINS,
          variables,
        } ).then( ( { data } ) =>
          callback( { inputText, data: data?.res } ) )
          .catch( console.log )
      }, 5000 ),
    [ splitsOrJoins ],
  )

  useEffect( () => {
    splitSearch( {
      inputText, limit, origin,
      inputScheme, outputScheme, strictIO,
    }, ( { inputText, data } ) => {
      setSplitsResult( data )
      setSansSplits( state => ( {
        ...state,
        data, inputText, origin, inputScheme, outputScheme, strictIO,
      } ) )
    } )
  }, [ splitSearch, setSansSplits, inputText, limit,
    inputScheme, outputScheme, strictIO ] )



  const toolbarActions = (
    <React.Fragment>
      {onClose && <IconButton
        aria-label="close"
        onClick={onClose}>
        <CloseIcon />
      </IconButton>}
    </React.Fragment>
  )

  return (
    <Panel title={'Sanscript Splits'}
      sx={{ border: 0, m: 2 }}
      toolbarActions={toolbarActions}
    >
      <Grid container spacing={1}>

        {/* Query Form */}
        <Grid item container spacing={2}>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={12} sm={9}>
              <TextField id="inputText" label="Input Text"
                placeholder="Input Text"
                variant="outlined" size="small"
                fullWidth
                value={inputText}
                onChange={e => setInputText( e.target?.value )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <ToggleButtonGroup
                  value={splitsOrJoins}
                  exclusive
                  onChange={( e, val ) => val && setSplitsOrJoins( val )}
                  size="small"
                >
                  <ToggleButton value="splits">Splits</ToggleButton>
                  <ToggleButton value="joins">Joins</ToggleButton>
                </ToggleButtonGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item xs={12} sm={6} spacing={1}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormControlLabel
                  label="Strict IO"
                  control={<Checkbox id="strictIO"
                    label="strictIOLbl"
                    value={strictIO}
                    onChange={e => setStrictIO( e.target.value )}
                    size="small" />}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="limitLbl">Limit</InputLabel>
                <Select
                  id="limit"
                  labelId="limitLbl"
                  value={limit}
                  label="Limit"
                  onChange={e => setLimit( Number( e.target.value ) )}
                  size="small"
                  fullWidth
                >
                  {[ 10, 25, 50, 100 ].map( l => <MenuItem key={l} value={l}>{l}</MenuItem> )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container item xs={12} sm={6} spacing={1}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="inputSchemeLbl">Input Scheme</InputLabel>
                <Select
                  id="inputScheme"
                  labelId="inputSchemeLbl"
                  value={inputScheme}
                  label="Input Scheme"
                  onChange={e => setInputScheme( e.target.value )}
                  size="small"
                  fullWidth
                >
                  {C_SANSCRIPT_SCHEME_MAP.map( l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem> )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="outputSchemeLbl">Output Scheme</InputLabel>
                <Select
                  id="outputScheme"
                  labelId="outputSchemeLbl"
                  value={outputScheme}
                  label="Output Scheme"
                  onChange={e => setOutputScheme( e.target.value )}
                  size="small"
                  fullWidth
                >
                  {C_SANSCRIPT_SCHEME_MAP.map( l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem> )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

        </Grid>
        {/* Query From End */}


        {/* Results */}
        <Grid item xs={12}>
          <Panel title={'Results'}
            sx={{ border: 0, mt: 2 }}
          >
            {/* <pre>{JSON.stringify( splitResult, null, 2 )}</pre> */}
            {splitsOrJoins === 'splits' && <SplitResults key={inputText} splits={splitResult} />}
            {splitsOrJoins === 'joins' && <JoinResults key={inputText} joins={splitResult} />}
          </Panel>
        </Grid>
        {/* Results End */}

      </Grid>
    </Panel >
  )
}

const SplitResults = ( { splits } ) => {
  return (
    <pre>{JSON.stringify( splits, null, 2 )}</pre>
  )
}

const JoinResults = ( { joins } ) => {
  return (
    <pre>{JSON.stringify( joins, null, 2 )}</pre>
  )
}

export default SanscriptSplitsPage