import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Divider, Fab, IconButton, Stack, Typography } from "@mui/material"
import Panel from "../components/utils/Panel"
import BackIcon from '@mui/icons-material/NavigateBefore'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import { gql, NetworkStatus, useMutation, useQuery } from '@apollo/client'
import { C_ENTITY_ATTR_MEANING, C_LANGUAGE_DEFAULT } from '../constants'
import { Fragment, useEffect, useState } from 'react'
import { useSnackbar } from 'notistack'
import { useRecoilValue } from 'recoil'
import { entityTypesState } from '../state/entityTypes'
import _ from 'lodash'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AudioPlayPauseButton from '../components/utils/AudioPlayPauseButton'
import { contentFont } from '../state/contentFont'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkOffIcon from '@mui/icons-material/BookmarkBorder'
import ToTopIcon from '@mui/icons-material/KeyboardArrowUp'
import useScroll from '../utils/useScroll'


const QUERY_GET_ENTITY_DETAILS = gql`
  query($id:ID, $language:String) {
    entities(by:{id:{value:$id}}){
      id
      type
      text(language: $language)
      childrenCount
      audio
      meaning(language: $language)
      bookmarked
      attributes{
        key
        value
      }
      notes
    }
  }
`
const MUTATION_UPDATE_ENTITY = gql`
  mutation($id:ID!, $data: EntityInput) {
    updateEntity(id:$id, withData: $data)
  }
`

export default function EntityDetailPage( { entityId, onClose } ) {
  const params = useParams()
  const [ searchParams ] = useSearchParams()
  const { search: queryParams } = useLocation()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const contentFontVal = useRecoilValue( contentFont )
  const [ executeScroll, elRef ] = useScroll()

  const [ refetching, setRefetching ] = useState( false )
  const [ entity, setEntity ] = useState( undefined )
  const [ bookmarked, setBookmarked ] = useState( false )

  const entityTypes = useRecoilValue( entityTypesState( searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT ) )

  const { loading, error, data, refetch, networkStatus } = useQuery( QUERY_GET_ENTITY_DETAILS,
    { variables: { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT, id: entityId || params.id } } )

  const [ updateEntityMutation, { data: mUpdData, error: mUpdError, loading: mUpdLoading } ] = useMutation( MUTATION_UPDATE_ENTITY )

  useEffect( () => {
    if ( data?.entities[ 0 ] ) {
      const { id, type, text, audio, meaning, attributes, notes, childrenCount, bookmarked } = data.entities[ 0 ]
      setEntity( {
        id, type, text, childrenCount, audio, meaning, attributes, notes, bookmarked,
        typeData: _.find( entityTypes, { 'code': type } )
      } )
      setBookmarked( bookmarked )
    } else {
      setEntity( undefined )
      setBookmarked( false )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ data ] )

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

  const toggleBookmark = async () => {
    // setRefetching( true )
    try {
      setBookmarked( !bookmarked )
      await updateEntityMutation( {
        variables: {
          id: entity.id,
          data: { bookmarked: !bookmarked },
        }
      } )
    } catch ( e ) {
      enqueueSnackbar( 'Error Updating Bookmark', { variant: 'error' } )
      setBookmarked( !bookmarked )
    }
    // setRefetching( false )
  }

  const toolbarActions = (
    <Fragment>
      <IconButton aria-label="Edit Entity"
        onClick={() => { onClose(); navigate( `/entity/${entity?.id}/edit${queryParams}` ) }}>
        <EditIcon />
      </IconButton>
      <IconButton disabled={loading || ( networkStatus === NetworkStatus.refetch ) || refetching}
        onClick={refetchData}>
        <RefreshIcon />
      </IconButton>
      {entity?.audio && <AudioPlayPauseButton url={entity?.audio} />}
      <IconButton disabled={loading || ( networkStatus === NetworkStatus.refetch ) || refetching}
        onClick={toggleBookmark}>
        {bookmarked ? <BookmarkIcon /> : <BookmarkOffIcon />}
      </IconButton>
      {onClose &&
        <IconButton
          aria-label="close"
          onClick={onClose}>
          <CloseIcon />
        </IconButton>
      }
    </Fragment >
  )

  return (
    <Panel title={entity?.typeData?.name || entity?.type || ''}
      titleIcon={
        !entityId && <IconButton size='small'
          onClick={() => navigate( -1 )}>
          <BackIcon />
        </IconButton>
      }
      sx={{ border: 0, m: { xs: 0, lg: 2 } }}
      loading={loading || refetching}
      error={error}
      onRefresh={refetchData}
      toolbarActions={toolbarActions}>
      <Stack spacing={2}>
        <div ref={elRef}></div>
        <Typography fontSize={contentFontVal.fontSize}
          letterSpacing={contentFontVal.letterSpacing}
          lineHeight={contentFontVal.lineHeight}>
          <ReactMarkdown
            children={entity?.text || `**no content**`}
            remarkPlugins={[ remarkGfm ]} />
        </Typography>

        <Divider />

        {entity?.meaning &&
          <>
            <Typography fontSize={contentFontVal.fontSize}
              letterSpacing={contentFontVal.letterSpacing}
              lineHeight={contentFontVal.lineHeight}>
              <ReactMarkdown
                children={`**Meaning**  \n\n` + ( entity?.meaning )}
                remarkPlugins={[ remarkGfm ]} />
            </Typography>

            <Divider />
          </>}
        {entity?.attributes?.find( e => e.key === C_ENTITY_ATTR_MEANING ) &&
          <>
            <Typography fontSize={contentFontVal.fontSize}
              letterSpacing={contentFontVal.letterSpacing}
              lineHeight={contentFontVal.lineHeight}>
              <ReactMarkdown
                children={`**Meaning Each Word**  \n\n` +
                  entity?.attributes?.find( e => e.key === C_ENTITY_ATTR_MEANING )?.value}
                remarkPlugins={[ remarkGfm ]} />
            </Typography>
            <Divider />
          </>
        }

        {entity?.notes &&
          <>
            <Typography fontSize={contentFontVal.fontSize}
              letterSpacing={contentFontVal.letterSpacing}
              lineHeight={contentFontVal.lineHeight}>
              <ReactMarkdown
                children={`**Notes**  \n\n` + ( _.get( entity, 'notes' ) || `**no notes**` )}

                remarkPlugins={[ remarkGfm ]} />
            </Typography>

            <Divider />
          </>}

        {/* <pre>{JSON.stringify( entity, null, 2 )}</pre> */}
      </Stack>
      <Fab color="secondary" aria-label='To Top'
        onClick={executeScroll}
        sx={{ position: 'fixed', bottom: 16, right: 24 }}>
        <ToTopIcon />
      </Fab>
    </Panel >
  )
}