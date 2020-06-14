import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import {
  Container,
} from 'semantic-ui-react'

import NavBar from './screens/nav_bar'
import Home from './screens/home_page'
import GodsPage from './screens/gods_page'
import AuthorsPage from './screens/authors_page'
import SettingsPage from './screens/settings_page'
import EntityPage from './screens/entity_page'

function App() {
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
            <Route path="/entity">
              <EntityPage />
            </Route>
          </Switch>
        </Container>
      </React.Fragment>
    </Router>
  );
}

export default App;
