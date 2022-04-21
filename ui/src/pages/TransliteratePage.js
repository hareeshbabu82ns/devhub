import { FormControl, Grid, Icon, IconButton, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from "@mui/material"
import Panel from "../components/utils/Panel"
import Sanscript from '@sanskrit-coders/sanscript'
import SwapIcon from '@mui/icons-material/SwapHorizOutlined';
import React, { startTransition, useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";
import { C_TRANSLATE_TEXT_MAP } from "../constants";

const TransliteratePage = () => {
  const [ fromTextLang, setFromTextLang ] = useState( 'slp1' )
  const [ toTextLang, setToTextLang ] = useState( 'telugu' )
  const [ fromText, setFromText ] = useState( 'Siva' )
  const [ toText, setToText ] = useState( '' )

  const translate = useMemo(
    () =>
      throttle( ( { input, fromTextLang, toTextLang }, callback ) => {
        // console.log( request )
        const toText = Sanscript.t( input, fromTextLang, toTextLang )
        callback( toText )
      }, 1000 ),
    [],
  )

  useEffect( () => {
    translate( { input: fromText, fromTextLang, toTextLang }, ( results ) => {
      setToText( results )
    } )
  }, [ fromText, translate, fromTextLang, toTextLang ] )


  const swapTexts = () => {
    startTransition( () => {
      setFromText( toText )
      setFromTextLang( toTextLang )
      setToText( fromText )
      setToTextLang( fromTextLang )
    } )
  }

  const toolbarActions = (
    <React.Fragment>
      <IconButton aria-label="swap texts"
        onClick={swapTexts}>
        <SwapIcon />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Panel title={'Transliterate'}
      sx={{ border: 0, m: 2 }}
      toolbarActions={toolbarActions}
    >
      <Grid container spacing={1}>

        <Grid item container xs={12} sm={6} spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="fromTextLangLabel">From</InputLabel>
              <Select
                id="fromTextLang"
                labelId="fromTextLangLabel"
                value={fromTextLang}
                label="From"
                onChange={e => setFromTextLang( e.target.value )}
                size="small"
                fullWidth
              >
                {C_TRANSLATE_TEXT_MAP.map( l => <MenuItem key={l.value} value={l.value}>{l.language}</MenuItem> )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize id="fromText" label="From Text"
              placeholder="From Text"
              variant="outlined" size="small"
              minRows={10}
              style={{ width: '100%' }}
              value={fromText}
              onChange={e => setFromText( e.target?.value )}
            />
          </Grid>
        </Grid>

        <Grid item container xs={12} sm={6} spacing={1}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="toTextLangLabel">To</InputLabel>
              <Select
                id="toTextLang"
                labelId="toTextLangLabel"
                value={toTextLang}
                label="To"
                onChange={e => setToTextLang( e.target.value )}
                size="small"
                fullWidth
              >
                {C_TRANSLATE_TEXT_MAP.map( l => <MenuItem key={l.value} value={l.value}>{l.language}</MenuItem> )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextareaAutosize id="toText" label="To Text"
              placeholder="To Text"
              variant="outlined" size="small"
              minRows={10}
              style={{ width: '100%' }}
              value={toText}
              readOnly
              spellCheck={false}
            />
          </Grid>
        </Grid>

      </Grid>
    </Panel>
  )
}
export default TransliteratePage