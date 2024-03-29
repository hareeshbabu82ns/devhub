import * as React from 'react'
import { ImageList, IconButton, useMediaQuery } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import { useSnackbar } from 'notistack'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import EntityGalaryItem from '../components/EntityGalaryItem'
import Panel from '../components/utils/Panel'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { C_LANGUAGE_DEFAULT } from '../constants'
import _ from 'lodash'
import { useRecoilValueLoadable } from 'recoil'
import { entityTypesState } from '../state/entityTypes'


const QUERY_GET_ENTITIES_BY_TYPE = gql`
  query($type:EntityTypeEnum, $language:String) {
    entities(by:{type:{value:$type}},limit:100){
      id
      type
      text(language: $language)
      imageThumbnail
    }
  }
`

export default function GodsPage() {

  const mediaSmUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'sm' ) )
  const mediaMdUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'md' ) )
  const mediaLgUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'lg' ) )
  const mediaXlUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'xl' ) )

  const [ searchParams ] = useSearchParams()
  const navigate = useNavigate()
  const { search: queryParams } = useLocation()

  const entityTypesLoadable = useRecoilValueLoadable( entityTypesState( searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT ) )

  const { enqueueSnackbar } = useSnackbar()

  const [ refetching, setRefetching ] = React.useState( false )

  const { loading, error, data, refetch, networkStatus } = useQuery( QUERY_GET_ENTITIES_BY_TYPE,
    { variables: { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT, type: 'GOD' } } )

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
      <IconButton aria-label="Create New Schema"
        onClick={() => navigate( `/entity/create${queryParams}` )}>
        <AddIcon />
      </IconButton>
      <IconButton disabled={loading || ( networkStatus === NetworkStatus.refetch ) || refetching}
        onClick={refetchData}>
        <RefreshIcon />
      </IconButton>
    </React.Fragment>
  )

  return (
    <Panel title={'Gods'} sx={{ border: 0, m: 2 }}
      loading={loading || refetching || entityTypesLoadable.state === 'loading'}
      error={error}
      onRefresh={refetchData}
      toolbarActions={toolbarActions}>
      {data?.entities?.length > 0 &&
        <ImageList gap={20}
          cols={mediaXlUp ? 5 : mediaLgUp ? 4 : mediaMdUp ? 3 : mediaSmUp ? 2 : 1} >
          {data?.entities?.map( i => ( { ...i, typeData: _.find( entityTypesLoadable.contents, { 'code': i.type } ) } ) )
            .map( ( item, i ) => (
              <EntityGalaryItem item={item} key={item.id}
                onSelect={() => navigate( `/entity/${item.id}${queryParams}` )} />
            ) )}
        </ImageList>}
    </Panel>
  )
}
