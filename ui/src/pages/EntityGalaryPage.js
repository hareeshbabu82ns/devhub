import * as React from 'react'
import { ImageList, IconButton, List } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useSnackbar } from 'notistack'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import EntityGalaryItem from '../components/EntityGalaryItem'
import Panel from '../components/utils/Panel'
import { useNavigate, useParams } from 'react-router-dom'
import { C_ENTITY_TYPE_SLOKAM } from '../constants'
import EntityTextListItem from '../components/EntityTextListItem'


const QUERY_GET_ENTITY_CHILDREN = gql`
  query($id:ID, $language:String) {
    entities(by:{id:{value:$id}}){
      id
      type
      text(language: $language)
      childrenCount
      children {
        id
        type
        text(language: $language)
      }
    }
  }
`

export default function EntityGalaryPage() {

  const params = useParams()
  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const [ refetching, setRefetching ] = React.useState( false )
  const [ entity, setEntity ] = React.useState( undefined )
  const [ children, setChildren ] = React.useState( [] )
  const [ hasTextContents, setHasTextContents ] = React.useState( false )

  const { loading, error, data, refetch, networkStatus } = useQuery( QUERY_GET_ENTITY_CHILDREN,
    { variables: { language: "SAN", id: params.id } } )

  React.useEffect( () => {
    if ( data?.entities[ 0 ] ) {
      const { id, type, text, childrenCount } = data.entities[ 0 ]
      setEntity( { id, type, text, childrenCount } )
      setChildren( data.entities[ 0 ].children )
      const index = data.entities[ 0 ].children.findIndex( e => e.type === C_ENTITY_TYPE_SLOKAM )
      setHasTextContents( index >= 0 )
    } else {
      setEntity( undefined )
      setChildren( [] )
      setHasTextContents( false )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ] )

  React.useEffect( () => {
    if ( error )
      enqueueSnackbar( 'Error fetching Entities', { variant: 'error' } )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ error ] )

  const refetchData = async () => {
    setRefetching( true )
    try {
      await refetch()
    } catch ( e ) {
      enqueueSnackbar( 'Error fetching Entities', { variant: 'error' } )
    }
    setRefetching( false )
  }

  const toolbarActions = (
    <React.Fragment>
      <IconButton disabled={loading || ( networkStatus === NetworkStatus.refetch ) || refetching}
        onClick={refetchData}>
        <RefreshIcon />
      </IconButton>
      {/* <IconButton aria-label="Create New Schema"
        onClick={() => navigate( 'new' )}>
        <AddIcon />
      </IconButton> */}
    </React.Fragment>
  )

  return (
    <Panel title={entity ? `${entity.type}: ${entity.text}` : 'Entity Children'}
      sx={{ border: 0, m: 2 }}
      loading={loading || refetching}
      error={error}
      onRefresh={refetchData}
      toolbarActions={toolbarActions}>

      {/* Children as Image List */}
      {( children?.length > 0 && !hasTextContents ) &&
        <ImageList gap={20} cols={5} >
          {children.map( ( item, i ) => (
            <EntityGalaryItem item={item} key={item.id}
              onSelect={() => navigate( `/entity/${item.id}` )} />
          ) )}
        </ImageList>}

      {/* Children as Text Items */}
      {( children?.length > 0 && hasTextContents ) &&
        <List sx={{ width: '100%' }} >
          {children.map( ( item, i ) => (
            <EntityTextListItem item={item} key={item.id} />
          ) )}
        </List>}

    </Panel>
  )
}
