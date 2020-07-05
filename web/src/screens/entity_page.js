/*
EntityPage (TODOs)
  Display Entity Content
  Use Entity Metadata for customizing the pages
  show ContentLines
  provide ContentMeaning
  ContentExtras for customizing lines or extra information
*/
import React from 'react'
import { Grid, Responsive } from 'semantic-ui-react'
import {
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";
import EntityChildNavbar from './entity_childs_sidenav'
import EntityList from '../components/entity_list'


const EntityPage = () => {
  const match = useRouteMatch()
  // console.log(match)
  return (
    <React.Fragment>
      <Responsive as={Grid} columns='2' divided
        minWidth={Responsive.onlyMobile.maxWidth} key='wide-screens'>
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
      </Responsive>
      <Responsive as={Grid} {...Responsive.onlyMobile} key='on-mobiles'>
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
      </Responsive>
    </React.Fragment >
  )
}

export default EntityPage