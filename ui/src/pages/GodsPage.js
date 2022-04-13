import * as React from 'react'
import { ImageList, IconButton } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useSnackbar } from 'notistack'
import { useQuery, gql, NetworkStatus } from '@apollo/client'
import EntityGalaryItem from '../components/EntityGalaryItem'
import Panel from '../components/utils/Panel'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { C_LANGUAGE_DEFAULT } from '../constants'


const QUERY_GET_ENTITIES_BY_TYPE = gql`
  query($type:EntityTypeEnum, $language:String) {
    entities(by:{type:{value:$type}}){
      id
      type
      text(language: $language)
    }
  }
`

export default function GodsPage() {

  const [ searchParams ] = useSearchParams()
  const navigate = useNavigate()
  const { search: queryParams } = useLocation()

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
    <Panel title={'Gods'} sx={{ border: 0, m: 2 }}
      loading={loading || refetching}
      error={error}
      onRefresh={refetchData}
      toolbarActions={toolbarActions}>
      {data?.entities?.length > 0 &&
        <ImageList gap={20} cols={5} >
          {data?.entities?.map( ( item, i ) => (
            <EntityGalaryItem item={item} key={item.id}
              onSelect={() => navigate( `/entity/${item.id}${queryParams}` )} />
          ) )}
        </ImageList>}
    </Panel>
  )
}
