import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Button, Stack, Typography } from '@mui/material';
import Panel from '../components/Panel';
import { useSnackbar } from 'notistack'

const QUERY_API_VERSION = gql`
  {
    version
  }
`
const MUTATION_CREATE_ENTITY = gql`
  mutation($data: EntityInput) {
    createEntity(withData: $data)
  }
`

function VersionContent() {
  const { enqueueSnackbar } = useSnackbar()
  const { loading, error, data, refetch, networkStatus } = useQuery( QUERY_API_VERSION )

  const [ createEntityMutation, { data: mData, error: mError, loading: mLoading } ] = useMutation( MUTATION_CREATE_ENTITY )

  const createEntity = async () => {
    const entityData = {
      type: "GOD",
      text: [
        {
          language: "ENG",
          value: "Eng Val"
        },
        {
          language: "SAN",
          value: "San Val"
        }
      ]
    }
    try {
      const res = await createEntityMutation( { variables: { data: entityData } } )
      enqueueSnackbar( 'Entity Created' )
      console.log( res )
    } catch ( e ) {
      enqueueSnackbar( 'Error Generating Entity', { variant: 'error' } )
      console.log( e )
    }

  }

  return (
    // <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Stack alignItems='center' gap={2}>

      <Typography variant="h6">
        Edit <code>src/App.tsx</code> and save to reload.
      </Typography>

      {loading && <Typography variant="h4">loading...</Typography>}
      {data && <Typography variant="h4">App is running on Version {data.version}</Typography>}

      <Button variant="contained" color="secondary"
        sx={{ mt: 4 }}
        onClick={createEntity} disabled={loading || mLoading} >
        Create Entity
      </Button>
    </Stack>
    // </Box >
  )
}

function AppContent() {
  return (
    <VersionContent />
  )
}

const HomePage = () => {
  return (
    <>
      <Panel title={'Sample Component'}>
        <AppContent />
      </Panel>
    </>
  )
}

export default HomePage