import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import { Grid, Segment } from 'semantic-ui-react';

import SanscriptSideNav from './SanscriptSideNav'
import SaTranslations from './SaTranslations'

const SanscriptHome = () => {
  let match = useRouteMatch();

  return (
    <Grid columns='2' divided>
      <Grid.Column width={4}>
        <SanscriptSideNav />
      </Grid.Column>
      <Grid.Column width={12}>
        <Switch>
          <Route path={`${match.url}/translations`}>
            <SaTranslations />
          </Route>
          <Route path="/">
            <div>
              <h1>Sanscript functionalities explorer</h1>
            </div>
          </Route>
        </Switch>
      </Grid.Column>
    </Grid>
  )
}
export default SanscriptHome