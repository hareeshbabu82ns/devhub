import React, { useState } from 'react'
import { GraphQLEditor, } from 'graphql-editor'
import { useRecoilValue } from 'recoil'
import { IconButton, Tooltip, Stack } from "@mui/material"
import SaveIcon from '@mui/icons-material/SaveOutlined'
import RefreshIcon from '@mui/icons-material/Refresh'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'

import { themeModeState, THEME_DARK } from '../state/theme_mode'
import editorTheme from '../theme/editorPalette'

export const GraphEditor = ( { code, libraries, onSave, onRefetch, onCopy,
  state, loading, enableImports = true } ) => {
  const themeMode = useRecoilValue( themeModeState )
  // console.log( editorTheme.dark )

  const [ isInvalid, setInvalid ] = useState( false )
  const [ schema, setSchema ] = useState( {
    code,
    libraries,
  } )

  // const onImportClick = ( ele ) => {
  //   // console.log( ele.innerText )
  // }

  const toolbarActions = (
    <React.Fragment>
      {onRefetch &&
        <Tooltip title="Refetch" placement='right-end'>
          <IconButton disabled={loading}
            onClick={() => onRefetch()}>
            <RefreshIcon fontSize='small' />
          </IconButton>
        </Tooltip>}

      {onSave &&
        <Tooltip title="Save" placement='right-end'>
          <IconButton
            size="small"
            onClick={() => onSave( schema )}
            disabled={loading || isInvalid}
          >
            <SaveIcon fontSize='small' />
          </IconButton>
        </Tooltip>}

      {onCopy &&
        <Tooltip title="Copy to Clipboard" placement='right-end'>
          <IconButton
            size="small"
            onClick={() => onCopy( schema )}
            disabled={loading || isInvalid}
          >
            <ContentCopyIcon fontSize='small' />
          </IconButton>
        </Tooltip>}

    </React.Fragment>
  )

  return (
    <React.Fragment>
      <div
        style={{
          zIndex: 2,
          width: '100%',
          alignSelf: 'stretch',
          position: 'relative',
          height: 'calc(100% - 65px)',
        }}
      >

        <Stack
          spacing={1}
          style={{ zIndex: '999', position: 'absolute', top: '174px', left: '4px' }}
        >
          {toolbarActions}
        </Stack>

        <GraphQLEditor
          initialSizeOfSidebar={'30vw'}
          // onStateChange={( props ) => { }}
          // onSchemaChange={( props ) => {
          //   setschema( props )
          // }}
          state={state}
          readonly={loading}
          setSchema={( props, isInvalid ) => { setInvalid( isInvalid ); setSchema( props ) }}
          schema={schema}
          theme={themeMode === THEME_DARK ? editorTheme.dark : editorTheme.light}
        />
      </div>
    </React.Fragment>

  )
}

export default GraphEditor