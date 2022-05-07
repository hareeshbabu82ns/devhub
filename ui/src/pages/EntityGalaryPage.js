import * as React from 'react'
import {
  ImageList, IconButton, List, useMediaQuery,
  ListItemIcon, ListItemText, MenuList, MenuItem
} from '@mui/material'
import BackIcon from '@mui/icons-material/NavigateBefore'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import NewIcon from '@mui/icons-material/Add'
import { useSnackbar } from 'notistack'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import EntityGalaryItem from '../components/EntityGalaryItem'
import Panel from '../components/utils/Panel'
import { useLocation, useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { C_ENTITY_TYPE_SLOKAM, C_LANGUAGE_DEFAULT, C_TRANSLATE_TEXT_MAP } from '../constants'
import EntityTextListItem from '../components/EntityTextListItem'
import _ from 'lodash'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { entityTypesState } from '../state/entityTypes'
import { entityDetailState } from '../state/entityDetail'

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

  const setEntityDetailDlg = useSetRecoilState( entityDetailState )

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
        onClick={() => navigate( `/entity/create/${entity?.id}${queryParams}` )}>
        <NewIcon />
      </IconButton>
      <IconButton disabled={loading || ( networkStatus === NetworkStatus.refetch ) || refetching}
        onClick={refetchData}>
        <RefreshIcon />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Panel title={entity ? `${entity.text}` : 'Entity Children'}
      titleIcon={
        <IconButton size='small'
          onClick={() => navigate( -1 )}>
          <BackIcon />
        </IconButton>
      }
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
            <EntityTextListItem item={item} key={item.id}
              onSelect={() => setEntityDetailDlg( s => ( { ...s, drawerOpened: true, entityId: item.id } ) )} />
            // onSelect={() => navigate( `/entity/${item.id}/details${queryParams}` )} />
          ) )}
        </List>}


    </Panel>
  )
}


