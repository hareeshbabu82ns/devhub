import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useQuery, gql, useMutation } from '@apollo/client';
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import ThemeModeSwitch from './components/ThemeModeSwitch';

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
  const { loading, error, data, refetch, networkStatus } = useQuery(QUERY_API_VERSION)

  const [createEntityMutation, { data: mData, error: mError, loading: mLoading }] = useMutation(MUTATION_CREATE_ENTITY)

  const createEntity = async () => {
    const res = await createEntityMutation({ variables: { data: { text: "test" } } })
    console.log(res)
  }

  return (
    // <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Stack alignItems='center' gap={2}>
      <img src={logo} className="App-logo" alt="logo" />

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
    <Box sx={{ display: 'flex', flexGrow: 1, flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}> DevHub</Typography>
          <ThemeModeSwitch />
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* <Toolbar /> */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <VersionContent />
        </Container>
      </Box>
    </Box>
  )
}


function App() {

  return (
    <AppContent />
  );
}


export default App;
