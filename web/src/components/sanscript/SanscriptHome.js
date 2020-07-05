import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import { Grid, Responsive } from 'semantic-ui-react';

import SanscriptSideNav from './SanscriptSideNav'
import SaTranslations from './SaTranslations'

const SanscriptHome = () => {
  let match = useRouteMatch();

  return (
    <React.Fragment>
      <Responsive as={Grid} columns='2' divided
        minWidth={Responsive.onlyMobile.maxWidth} key='wide-screens'>
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
      </Responsive>
      <Responsive as={Grid} {...Responsive.onlyMobile} key='on-mobiles'>
        <Grid.Column width={16}>
          {
            <Switch>
              <Route path={`${match.url}`} exact>
                <SanscriptSideNav />
              </Route>
              <Route path={`${match.url}/translations`}>
                <SaTranslations />
              </Route>
            </Switch>
          }
        </Grid.Column>
      </Responsive>
    </React.Fragment>
  )
}
export default SanscriptHome