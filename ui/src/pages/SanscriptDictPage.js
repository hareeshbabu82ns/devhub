import { Dialog, FormControl, Grid, InputLabel, List, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material"
import Panel from "../components/utils/Panel"
import React, { useEffect, useMemo, useState } from "react"
import { throttle } from "lodash"
import { C_DICTIONARY_MAP, C_SANSCRIPT_SCHEME_MAP } from "../constants"
import { useRecoilState } from "recoil"
import { sanscriptDictState } from "../state/sanscriptDict"
import { gql, useQuery } from "@apollo/client"
import client from '../utils/GqlClient'
import ReactMarkdown from 'react-markdown'
import remarkGfm from "remark-gfm"

const QUERY_SEARCH_DICT = gql`
  query search($searchWith: DictionarySearchInput!){
    dictionarySearch(searchWith:$searchWith){
      id
      key
      origin
    }
  }
`

const C_SEARCH_SWITCH_MAP = [ { label: 'Fuzzy Search', value: 'fuzzySearch' },
{ label: 'Search Only Keys', value: 'searchOnlyKeys' },
{ label: 'Ignore Case', value: 'caseInsensitive' },
{ label: 'Starts With', value: 'startsWith' },
{ label: 'Ends With', value: 'endsWith' },
]

const switchToMap = ( switchesValue ) => {
  return {
    fuzzySearch: !!switchesValue?.includes( 'fuzzySearch' ),
    searchOnlyKeys: !!switchesValue?.includes( 'searchOnlyKeys' ),
    caseInsensitive: !!switchesValue?.includes( 'caseInsensitive' ),
    startsWith: !!switchesValue?.includes( 'startsWith' ),
    endsWith: !!switchesValue?.includes( 'endsWith' ),
  }
}
const switchFromState = ( state ) => {
  const val = []
  if ( state?.fuzzySearch ) val.push( 'fuzzySearch' )
  if ( state?.searchOnlyKeys ) val.push( 'searchOnlyKeys' )
  if ( state?.caseInsensitive ) val.push( 'caseInsensitive' )
  if ( state?.startsWith ) val.push( 'startsWith' )
  if ( state?.endsWith ) val.push( 'endsWith' )
  return val
}

const SanscriptDictPage = () => {

  const [ sdict, setSansDict ] = useRecoilState( sanscriptDictState )

  const [ inputText, setInputText ] = useState( sdict.inputText )
  const [ limit, setLimit ] = useState( sdict.limit )
  const [ origin, setOrigin ] = useState( sdict.origin )
  const [ inputScheme, setInputScheme ] = useState( sdict.inputScheme )
  const [ outputScheme, setOutputScheme ] = useState( sdict.outputScheme )
  const [ switches, setSwitches ] = useState( switchFromState( sdict ) )

  const [ dictResult, setDictResult ] = useState( [] )

  const [ openDetailDlg, setOpenDetailDlg ] = React.useState( false );
  const [ detailDlgItem, setDetailDlgItem ] = React.useState( undefined );

  const dictSearch = useMemo(
    () =>
      throttle( ( { inputText, inputScheme, outputScheme,
        limit, origin, switches }, callback ) => {
        if ( !inputText ) {
          callback( { inputText, data: [] } )
          return
        }
        client.query( {
          query: QUERY_SEARCH_DICT,
          variables: {
            searchWith: {
              search: inputText,
              limit: Number( limit ),
              origin,
              searchScheme: inputScheme,
              outputScheme,
              ...switchToMap( switches )
            }
          }
        } ).then( ( { data } ) =>
          callback( { inputText, data: data?.dictionarySearch } ) )
          .catch( console.log )
      }, 1000 ),
    [],
  )

  useEffect( () => {
    dictSearch( {
      inputText, limit, origin,
      inputScheme, outputScheme, switches,
    }, ( { inputText, data } ) => {
      setDictResult( data )
      setSansDict( state => ( {
        ...state,
        data, inputText, origin, inputScheme, outputScheme,
        ...switchToMap( switches ),
      } ) )
    } )
  }, [ dictSearch, setSansDict, inputText, limit, origin,
    inputScheme, outputScheme, switches ] )



  const toolbarActions = (
    <React.Fragment>

    </React.Fragment>
  )

  const handleItemSelected = ( item ) => {
    setOpenDetailDlg( true )
    setDetailDlgItem( item )
  }

  return (
    <Panel title={'Sanscript Dict'}
      sx={{ border: 0, m: 2 }}
      toolbarActions={toolbarActions}
    >
      <Grid container spacing={1}>

        {/* Query Form */}
        <Grid item container spacing={2}>

          <Grid container item xs={12} spacing={1}>
            <Grid item xs={12} sm={9}>
              <TextField id="inputText" label="Search Text"
                placeholder="Search Text"
                variant="outlined" size="small"
                fullWidth
                value={inputText}
                onChange={e => setInputText( e.target?.value )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
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
                <InputLabel id="switchLbl">Search Switches</InputLabel>
                <Select
                  id="switch"
                  labelId="switchLbl"
                  value={switches}
                  label="Search Switches"
                  onChange={e => setSwitches( e.target.value )}
                  size="small"
                  fullWidth
                  multiple
                >
                  {C_SEARCH_SWITCH_MAP.map( l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem> )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="originLbl">Dictionary</InputLabel>
                <Select
                  id="origin"
                  labelId="originLbl"
                  value={origin}
                  label="Dictionary"
                  onChange={e => setOrigin( e.target.value )}
                  size="small"
                  fullWidth
                  multiple
                >
                  {C_DICTIONARY_MAP.map( l => <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem> )}
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
            <List>
              {dictResult?.map( i =>
                <DictionaryListItem key={i.id} item={i}
                  onItemSelected={handleItemSelected} /> )}
            </List>
          </Panel>
        </Grid>
        {/* Results End */}

      </Grid>

      <SimpleDialog
        open={openDetailDlg}
        onClose={() => setOpenDetailDlg( false )}
        selectedItem={detailDlgItem}
        outputScheme={outputScheme}
      />
    </Panel >
  )
}

const DictionaryListItem = ( { item, onItemSelected } ) => {

  return (
    <ListItemButton alignItems="flex-start"
      sx={{ border: 1, borderRadius: 1, mt: 1 }}
      onClick={() => onItemSelected( { id: item.id, key: item.key, origin: item.origin } )}
    >
      {/* <pre>{JSON.stringify( item, null, 2 )}</pre> */}
      <ListItemAvatar>
      </ListItemAvatar>
      <ListItemText
        primary={item.key}
        secondary={item.origin}
      />
    </ListItemButton>
  )
}

const QUERY_SEARCH_DICT_BY_ID = gql`
  query search($id: ID!, $outputScheme: SanscriptScheme){
    dictionarySearchById(id:$id, outputScheme: $outputScheme){
      id
      key
      origin
      description
    }
  }
`

function SimpleDialog( props ) {
  const { onClose, open, selectedItem, outputScheme } = props;

  const handleClose = () => {
    onClose();
  };

  const { data, loading, error } = useQuery( QUERY_SEARCH_DICT_BY_ID,
    { variables: { id: selectedItem?.id || 0, outputScheme } } )

  return (
    <Dialog onClose={handleClose}
      open={open} scroll={'paper'}
      // fullScreen={true}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <Panel
        sx={{ border: 0 }}
        title={`${selectedItem?.key} from ${selectedItem?.origin}`}
        loading={loading} error={error}>
        {/* <pre>{JSON.stringify( data, null, 2 )}</pre> */}
        <Typography variant='h5'>
          <ReactMarkdown
            children={data?.dictionarySearchById?.description}
            remarkPlugins={[ remarkGfm ]} />
        </Typography>
      </Panel>
    </Dialog>
  );
}
export default SanscriptDictPage