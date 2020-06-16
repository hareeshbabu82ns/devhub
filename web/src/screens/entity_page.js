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


const EntityPage = () => {
  const match = useRouteMatch()
  console.log(match)
  return (
    <Grid columns='2' divided>
      <Grid.Column width={4}>
        <EntityChildNavbar entityId={match.params.entityId} />
      </Grid.Column>
      <Grid.Column>
        {
          <Switch>
            <Route path={`${match.url}/:entityTypeName`}>
              <EntityList entityId={match.params.entityId} />
            </Route>
          </Switch>
        }
      </Grid.Column>
    </Grid>
  )
}

export default EntityPage