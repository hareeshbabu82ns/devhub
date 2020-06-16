import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import {
  Container,
  Segment
} from 'semantic-ui-react'
import { C_ENTITY_TYPE_STOTRAM } from './utils/constants'
import { gql, useQuery } from '@apollo/client'
import { useSetRecoilState } from 'recoil'
import NavBar from './screens/nav_bar'
import Home from './screens/home_page'
import GodsPage from './screens/gods_page'
import AuthorsPage from './screens/authors_page'
import SettingsPage from './screens/settings_page'
import EntityPage from './screens/entity_page'
import SthotramPage from './screens/sthotram_page'

import { baseTypes } from './state/base_types'

function AppRoutes() {
  return (
    <Router>
      <React.Fragment>
        <NavBar />
        <Container fluid style={{ marginTop: '7em' }}>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route path="/gods">
              <GodsPage />
            </Route>
            <Route path="/authors">
              <AuthorsPage />
            </Route>
            <Route path="/settings">
              <SettingsPage />
            </Route>
            <Route path={`/${C_ENTITY_TYPE_STOTRAM}/:stotramId`}>
              <SthotramPage />
            </Route>
            <Route path="/:entityName/:entityId">
              <EntityPage />
            </Route>
          </Switch>
        </Container>
      </React.Fragment>
    </Router>
  );
}

const FETCH_BASE_TYPES = gql`
query {
  entityTypes{
    id
    name
    description
  }
  languages{
    id
    iso
    description
  }  
}
`;
function App() {
  const setBaseTypes = useSetRecoilState(baseTypes)

  const { loading, error, data } = useQuery(FETCH_BASE_TYPES);

  if (loading) return <Segment loading> Loading Content... </Segment>;
  if (error) return <Segment>Error loading Base Data</Segment>;

  setBaseTypes(() => ({ ...data }))

  return (<AppRoutes />)
}

export default App;
