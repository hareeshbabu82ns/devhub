import {
  Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputLabel,
  MenuItem, Select, Stack, TextField, ToggleButton, ToggleButtonGroup
} from "@mui/material"
import Panel from "../components/utils/Panel"
import CloseIcon from '@mui/icons-material/Close'
import React, { useMemo, useState } from "react"
import { throttle } from "lodash"
import { C_SANSCRIPT_SCHEME_MAP } from "../constants"
import { useRecoilState } from "recoil"
import { sanscriptSplitsState } from "../state/sanscriptSplits"
import { gql } from "@apollo/client"
import client from '../utils/GqlClient'
import { useSnackbar } from 'notistack'
import SubmitIcon from '@mui/icons-material/Send'


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


  const { enqueueSnackbar } = useSnackbar()

  const [ ssplits, setSansSplits ] = useRecoilState( sanscriptSplitsState )

  const [ splitsOrJoins, setSplitsOrJoins ] = useState( ssplits.splitsOrJoins )
  const [ inputText, setInputText ] = useState( ssplits.inputText )
  const [ inputWords, setInputWords ] = useState( ssplits.inputWords )
  const [ limit, setLimit ] = useState( ssplits.limit )
  const [ strictIO, setStrictIO ] = useState( ssplits.strictIO )
  const [ inputScheme, setInputScheme ] = useState( ssplits.inputScheme )
  const [ outputScheme, setOutputScheme ] = useState( ssplits.outputScheme )

  const [ splitResult, setSplitsResult ] = useState( ssplits.splitsData )
  const [ joinResult, setJoinsResult ] = useState( ssplits.joinsData )
  const [ loading, setLoading ] = useState( false )

  const splitSearch = useMemo(
    () =>
      throttle( ( { inputText, inputWords, inputScheme, outputScheme,
        limit, strictIO }, callback ) => {
        if ( !inputText && splitsOrJoins === 'splits' ) {
          callback( { inputText, inputWords, splitsData: [], joinsData: joinResult } )
          return
        }
        if ( !inputWords && splitsOrJoins === 'joins' ) {
          callback( { inputText, inputWords, splitsData: splitResult, joinsData: [] } )
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
          variables.words = inputWords.split( ',' )
        }
        setLoading( true )
        client.query( {
          query: splitsOrJoins === 'splits' ? QUERY_SANSCRIPT_SPLITS : QUERY_SANSCRIPT_JOINS,
          variables,
        } ).then( ( { data } ) => {
          callback( {
            inputText, inputWords,
            splitsData: splitsOrJoins === 'splits' ? data?.res : splitResult,
            joinsData: splitsOrJoins === 'joins' ? data?.res : joinResult,
          } )
        } ).catch( ( e ) => {
          enqueueSnackbar( 'Error in Operation', { variant: 'error' } )
          console.log( e )
        } )
          .finally( () => setLoading( false ) )
      }, 5000 ),
    [ enqueueSnackbar, joinResult, splitResult, splitsOrJoins ],
  )

  // useEffect( () => {
  //   splitSearch( {
  //     inputText, limit, origin,
  //     inputScheme, outputScheme, strictIO,
  //   }, ( { inputText, data } ) => {
  //     setSplitsResult( data )
  //     setSansSplits( state => ( {
  //       ...state,
  //       data, inputText, origin, inputScheme, outputScheme, strictIO,
  //     } ) )
  //   } )
  // }, [ splitSearch, setSansSplits, inputText, limit,
  //   inputScheme, outputScheme, strictIO ] )

  const onSubmit = () => {
    splitSearch( {
      inputText, inputWords, limit, origin,
      inputScheme, outputScheme, strictIO,
    }, ( { inputText, inputWords, splitsData, joinsData } ) => {
      setSplitsResult( splitsData )
      setJoinsResult( joinsData )
      setSansSplits( state => ( {
        ...state,
        splitsData, joinsData, inputText, inputWords,
        origin, inputScheme, outputScheme, strictIO,
      } ) )
    } )
  }


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
              <Stack direction={'row'} spacing={1}>
                {splitsOrJoins === 'splits' && <TextField id="inputText" label="Input Text"
                  placeholder="Input Text"
                  variant="outlined" size="small"
                  fullWidth
                  value={inputText}
                  onChange={e => setInputText( e.target?.value )}
                />}
                {splitsOrJoins === 'joins' && <TextField id="inputWords" label="Input Words"
                  placeholder="Input Words"
                  variant="outlined" size="small"
                  fullWidth
                  value={inputWords}
                  onChange={e => setInputWords( e.target?.value )}
                />}
                <IconButton aria-label="Submit"
                  onClick={onSubmit}>
                  <SubmitIcon />
                </IconButton>
              </Stack>
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
            loading={loading}
          >
            {/* <pre>{JSON.stringify( splitResult, null, 2 )}</pre> */}
            {splitsOrJoins === 'splits' && <SplitResults key={inputText} splits={splitResult} />}
            {splitsOrJoins === 'joins' && <JoinResults key={inputWords} joins={joinResult} />}
          </Panel>
        </Grid>
        {/* Results End */}

      </Grid>
    </Panel >
  )
}

const SplitResults = ( { splits } ) => {
  return (
    // <pre>{JSON.stringify( splits, null, 2 )}</pre>
    <table style={{ width: '100%', overflowX: 'scroll' }}>
      <tbody>
        {splits.map( ( s, si ) => (
          <tr key={`split-${si}`}>
            {s.map( ( ss, ssi ) => (
              <td key={`subsplit-${ssi}`}>
                {ss}
              </td> ) )}
          </tr> ) )}
      </tbody>
    </table>
  )
}

const JoinResults = ( { joins } ) => {
  return (
    <pre>{JSON.stringify( joins, null, 2 )}</pre>
  )
}

export default SanscriptSplitsPage