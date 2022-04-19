import * as React from 'react'
import { ImageList, IconButton, List, useMediaQuery } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import { useSnackbar } from 'notistack'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import EntityGalaryItem from '../components/EntityGalaryItem'
import Panel from '../components/utils/Panel'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { C_ENTITY_TYPE_SLOKAM, C_LANGUAGE_DEFAULT } from '../constants'
import EntityTextListItem from '../components/EntityTextListItem'
import _ from 'lodash'
import { useRecoilValue } from 'recoil'
import { entityTypesState } from '../state/entityTypes'

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
        imageThumbnail
      }
    }
  }
`

export default function EntityGalaryPage() {

  const mediaSmUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'sm' ) )
  const mediaMdUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'md' ) )
  const mediaLgUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'lg' ) )
  const mediaXlUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'xl' ) )

  const params = useParams()
  const [ searchParams ] = useSearchParams()
  const { search: queryParams } = useLocation()
  const navigate = useNavigate()

  const { enqueueSnackbar } = useSnackbar()

  const entityTypes = useRecoilValue( entityTypesState( searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT ) )

  const [ refetching, setRefetching ] = React.useState( false )
  const [ entity, setEntity ] = React.useState( undefined )
  const [ children, setChildren ] = React.useState( [] )
  const [ hasTextContents, setHasTextContents ] = React.useState( false )

  const { loading, error, data, refetch, networkStatus } = useQuery( QUERY_GET_ENTITY_CHILDREN,
    { variables: { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT, id: params.id } } )

  React.useEffect( () => {
    if ( data?.entities[ 0 ] ) {
      const { id, type, text, childrenCount } = data.entities[ 0 ]
      setEntity( { id, type, text, childrenCount, typeData: _.find( entityTypes, { 'code': type } ) } )
      setChildren( data.entities[ 0 ].children
        .map( i => ( { ...i, typeData: _.find( entityTypes, { 'code': i.type } ) } ) ) )
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
      <IconButton aria-label="Edit Entity"
        onClick={() => navigate( `/entity/${entity?.id}/edit${queryParams}` )}>
        <EditIcon />
      </IconButton>
      <IconButton disabled={loading || ( networkStatus === NetworkStatus.refetch ) || refetching}
        onClick={refetchData}>
        <RefreshIcon />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Panel title={entity ? `${entity.text}` : 'Entity Children'}
      sx={{ border: 0, m: 2 }}
      loading={loading || refetching}
      error={error}
      onRefresh={refetchData}
      toolbarActions={toolbarActions}>

      {/* Children as Image List */}
      {( children?.length > 0 && !hasTextContents ) &&
        <ImageList gap={20}
          cols={mediaXlUp ? 5 : mediaLgUp ? 4 : mediaMdUp ? 3 : mediaSmUp ? 2 : 1} >
          {children.map( ( item, i ) => (
            <EntityGalaryItem item={item} key={item.id}
              onSelect={() => navigate( `/entity/${item.id}${queryParams}` )} />
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
