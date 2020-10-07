/*
EntityPage (TODOs)
  Display Entity Content
  Use Entity Metadata for customizing the pages
  show ContentLines
  provide ContentMeaning
  ContentExtras for customizing lines or extra information
*/
import React from 'react'
import { Grid } from 'semantic-ui-react'
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import EntityChildNavbar from './entity_childs_sidenav'
import EntityList from '../components/entity_list'
import { Media } from '../utils/media_context'

const EntityPage = () => {
  const match = useRouteMatch()
  // console.log(match)
  return (
    <React.Fragment>
      <Media greaterThanOrEqual="computer" key='wide-screens'>
        <Grid columns='2' divided>
          <Grid.Column width={5}>
            <EntityChildNavbar entityId={match.params.entityId} />
          </Grid.Column>
          <Grid.Column width={11}>
            {
              <Switch>
                <Route path={`${match.url}/:entityTypeName`}>
                  <EntityList entityId={match.params.entityId} />
                </Route>
              </Switch>
            }
          </Grid.Column>
        </Grid>
      </Media>
      <Media lessThan="computer" key='on-mobiles'>
        <Grid>
          <Grid.Column width={16}>
            {
              <Switch>
                <Route path={`${match.url}`} exact>
                  <EntityChildNavbar entityId={match.params.entityId} />
                </Route>
                <Route path={`${match.url}/:entityTypeName`}>
                  <EntityList entityId={match.params.entityId} />
                </Route>
              </Switch>
            }
          </Grid.Column>
        </Grid>
      </Media>
    </React.Fragment >
  )
}

export default EntityPage