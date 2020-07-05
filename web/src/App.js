import React from 'react';

import 'react-toastify/dist/ReactToastify.css'
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import {
  Sidebar,
  Segment,
  Responsive,
} from 'semantic-ui-react'

import { C_ENTITY_TYPE_STOTRAM, C_ENTITY_TYPE_DANDAKAM, C_ENTITY_TYPE_SARGA } from './utils/constants'
import { gql, useQuery } from '@apollo/client'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import NavBar from './screens/nav_bar'
import Home from './screens/home_page'
import GodsPage from './screens/gods_page'
import AuthorsPage from './screens/authors_page'
import SettingsPage from './screens/settings_page'
import EntityPage from './screens/entity_page'
import NavBarSidebar from './screens/nav_bar_sidebar'
import SingleChildContentPage from './screens/single_child_page'
import OperationModal from './components/operation_modal'
import SanscriptHome from './components/sanscript/SanscriptHome'

import settings from './state/settings'
import { baseTypes } from './state/base_types'

function AppRoutes() {
  const { appSideBarVisible } = useRecoilValue(settings)
  const setSetting = useSetRecoilState(settings)
  return (
    <Router>
      <React.Fragment>
        <NavBar />
        <Responsive as={React.Fragment} minWidth={Responsive.onlyMobile.maxWidth} key='wide-screens'>
          <AppRouteSwitches />
        </Responsive>
        <Responsive as={React.Fragment} {...Responsive.onlyMobile} key='on-mobiles'>
          <Sidebar.Pushable as={React.Fragment}>
            <Sidebar visible={appSideBarVisible}
              onHide={() => setSetting(oldSetting => ({ ...oldSetting, appSideBarVisible: false }))}
              vertical animation='overlay'>
              <NavBarSidebar />
            </Sidebar>
            <Sidebar.Pusher dimmed={appSideBarVisible}>
              <AppRouteSwitches />
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Responsive>
      </React.Fragment>
    </Router>
  );
}

function AppRouteSwitches() {
  return (
    <div style={{ margin: '5em 0.5em 0.5em 0.5em' }} >
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
        <Route path="/sanscript">
          <SanscriptHome />
        </Route>
        <Route path={`/${C_ENTITY_TYPE_STOTRAM}/:entityId`}>
          <SingleChildContentPage />
        </Route>
        <Route path={`/${C_ENTITY_TYPE_SARGA}/:entityId`}>
          <SingleChildContentPage />
        </Route>
        <Route path={`/${C_ENTITY_TYPE_DANDAKAM}/:entityId`}>
          <SingleChildContentPage />
        </Route>
        <Route path="/:entityName/:entityId">
          <EntityPage />
        </Route>
      </Switch>
      <OperationModal />
    </div>
  )
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

  return (
    <React.Fragment>
      <AppRoutes />
      <ToastContainer closeButton={false} style={{ width: '400px' }} />
    </React.Fragment>
  )
}

export default App;
