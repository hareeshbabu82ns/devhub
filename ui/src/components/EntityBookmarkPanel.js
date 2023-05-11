import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { IconButton, ImageList, Stack, useMediaQuery } from "@mui/material"
import Panel from "../components/utils/Panel"
import RefreshIcon from '@mui/icons-material/Refresh'
import { gql, NetworkStatus, useQuery } from '@apollo/client'
import { C_LANGUAGE_DEFAULT } from '../constants'
import { Fragment, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useRecoilValue } from 'recoil'
import { entityTypesState } from '../state/entityTypes'
import _ from 'lodash'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import EntityGalaryItem from './EntityGalaryItem'


const QUERY_BOOKMARKED_ENTITIES = gql`
  query($language:String) {
    entities(by:{bookmarked:{value:true}}){
      id
      type
      parents {
        id
        text(language: $language)
        type
        imageThumbnail
        parents {
          id
          text(language: $language)
          type
          imageThumbnail
          parents {
            id
            text(language: $language)
            type
            imageThumbnail
            parents {
              id
              text(language: $language)
              type
              imageThumbnail
            }
          }
        }
      }      
    }
  }
`

export default function EnityBookmarkPanel() {

  const mediaSmUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'sm' ) )
  const mediaMdUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'md' ) )
  const mediaLgUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'lg' ) )
  const mediaXlUp = useMediaQuery( ( theme ) => theme.breakpoints.up( 'xl' ) )

  const [ searchParams ] = useSearchParams()
  const { search: queryParams } = useLocation()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [ refetching, setRefetching ] = useState( false )

  const entityTypes = useRecoilValue( entityTypesState( searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT ) )

  const { loading, error, data, refetch, networkStatus } = useQuery( QUERY_BOOKMARKED_ENTITIES,
    { variables: { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT } } )


  useEffect( () => {
    if ( error )
      enqueueSnackbar( 'Error fetching Entities', { variant: 'error' } )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ error ] )

  const refetchData = async () => {
    setRefetching( true )
    try {
      await refetch()
    } catch ( e ) {
      enqueueSnackbar( 'Error fetching Entity Details', { variant: 'error' } )
    }
    setRefetching( false )
  }


  const toolbarActions = (
    <Fragment>
      {/* <IconButton aria-label="To Entity"
        onClick={() => { navigate( `/entity/${data?.entities[ 0 ]?.parents[ 0 ]?.id}${queryParams}` ) }}>
        <EditIcon />
      </IconButton> */}
      <IconButton disabled={loading || ( networkStatus === NetworkStatus.refetch ) || refetching}
        onClick={refetchData}>
        <RefreshIcon />
      </IconButton>
    </Fragment >
  )

  return (
    <Panel title={'Bookmarks'}
      titleIcon={
        <IconButton size='small'>
          <BookmarkIcon />
        </IconButton>
      }
      sx={{ border: 0, m: { xs: 0, lg: 2 } }}
      loading={loading || refetching}
      error={error}
      onRefresh={refetchData}
      toolbarActions={toolbarActions}>
      <Stack spacing={2}>
        {( data?.entities && data.entities?.length > 0 ) &&
          <ImageList gap={20}
            cols={mediaXlUp ? 5 : mediaLgUp ? 4 : mediaMdUp ? 3 : mediaSmUp ? 2 : 1} >
            {data.entities.map( ( item, i ) => (
              <EntityGalaryItem item={item.parents[ 0 ]} key={item.id}
                onSelect={() => navigate( `/entity/${item.parents[ 0 ].id}${queryParams}` )} />
            ) )}
          </ImageList>}
        {/* <pre>{JSON.stringify( data, null, 2 )}</pre> */}
      </Stack>
    </Panel >
  )
}