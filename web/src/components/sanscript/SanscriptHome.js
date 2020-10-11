import React from 'react'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import { Grid } from 'semantic-ui-react';

import SanscriptSideNav from './SanscriptSideNav'
import SaTranslations from './SaTranslations'
import SaDictionaries from './SaDictionaries'
import SaParser from './SaParser'
import { Media } from '../../utils/media_context'

const SanscriptHome = () => {
  let match = useRouteMatch();

  return (
    <React.Fragment>
      <Media greaterThanOrEqual="computer" key='wide-screens'>
        <Grid columns='2' divided>
          <Grid.Column width={4}>
            <SanscriptSideNav />
          </Grid.Column>
          <Grid.Column width={12}>
            <Switch>
              <Route path={`${match.url}/translations`}>
                <SaTranslations />
              </Route>
              <Route path={`${match.url}/dictionaries`}>
                <SaDictionaries />
              </Route>
              <Route path={`${match.url}/parser`}>
                <SaParser />
              </Route>
              <Route path="/">
                <div>
                  <h1>Sanscript functionalities explorer</h1>
                </div>
              </Route>
            </Switch>
          </Grid.Column>
        </Grid>
      </Media>
      <Media lessThan="computer" key='on-mobiles'>
        <Grid>
          <Grid.Column width={16}>
            {
              <Switch>
                <Route path={`${match.url}`} exact>
                  <SanscriptSideNav />
                </Route>
                <Route path={`${match.url}/translations`}>
                  <SaTranslations />
                </Route>
                <Route path={`${match.url}/dictionaries`}>
                  <SaDictionaries />
                </Route>
                <Route path={`${match.url}/parser`}>
                  <SaParser />
                </Route>
              </Switch>
            }
          </Grid.Column>
        </Grid>
      </Media>
    </React.Fragment>
  )
}
export default SanscriptHome