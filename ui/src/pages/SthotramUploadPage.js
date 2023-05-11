import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'
import { IconButton } from '@mui/material'
import Panel from '../components/utils/Panel'
import { useSnackbar } from 'notistack'
import Editor from "@monaco-editor/react"
import { themeModeState, THEME_DARK } from '../state/theme_mode'
import UploadIcon from '@mui/icons-material/Upload'
import { uploadSthotram } from '../utils/gql_utils'

const UploadForm = ( { onChange } ) => {
  const themeMode = useRecoilValue( themeModeState )
  return (
    <React.Fragment>
      <Editor
        height="85vh"
        defaultLanguage="json"
        defaultValue={JSON.stringify( DEFAULT_ENTITY_CHILD_CONTENT_V1_SRC, null, '\t' )}
        theme={themeMode === THEME_DARK ? 'vs-dark' : 'light'}
        onChange={( value, editor ) => onChange( value )}
      />
    </React.Fragment>
  )
}


const SthotramUploadPage = () => {

  const { enqueueSnackbar } = useSnackbar()


  const [ loading, setLoading ] = useState( false )
  const [ editorValue, setEditorValue ] = useState( JSON.stringify( DEFAULT_ENTITY_CHILD_CONTENT_V1_SRC ) )


  const upload = async () => {
    try {
      setLoading( true )
      const inputData = JSON.parse( editorValue )
      const res = await uploadSthotram( inputData )
      enqueueSnackbar( 'Entity Created' )
      console.log( res )
    } catch ( e ) {
      enqueueSnackbar( 'Error Generating Entity', { variant: 'error' } )
      console.log( e )
    } finally {
      setLoading( false )
    }
  }


  const toolbarActions = (
    <React.Fragment>
      <IconButton disabled={loading}
        onClick={upload}>
        <UploadIcon />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Panel title={'Sthotram Uploader'} sx={{ m: 2 }}
      toolbarActions={toolbarActions}>
      <UploadForm onChange={v => setEditorValue( v )} />
    </Panel>
  )
}


const DEFAULT_ENTITY_CHILD_CONTENT_V1_SRC = {
  "parent": {
    "type": "GOD",
    "textData": {
      "TEL": {
        "text": "GOD 1 tel"
      },
      "SAN": {
        "text": "GOD 1 san"
      },
      "IAST": {
        "text": "GOD 1 iast"
      }
    }
  },
  "entity": {
    "type": "STHOTRAM",
    "source": "https://google.com/",
    "textData": {
      "TEL": {
        "text": "sthotram 1 tel"
      },
      "SAN": {
        "text": "sthotram 1 san"
      },
      "IAST": {
        "text": "sthotram 1 iast"
      }
    }
  },
  "contents": {
    "type": "SLOKAM",
    "TEL": {
      "contents": [
        "slokam 1 tel",
        "slokam 2 tel",
      ],
    },
    "SAN": {
      "contents": [
        "slokam 1 san",
        "slokam 2 san",
      ],
    },
    "IAST": {
      "contents": [
        "slokam 1 iast",
        "slokam 2 iast",
      ],
    },
  }
}


export default SthotramUploadPage