import React, { Component } from 'react';

import { Container, Menu, Icon } from "semantic-ui-react";
import { Router, Route, Switch, NavLink, Redirect } from "react-router-dom";

import AppMenu from './app-menu';
import DashboardPage from './dashboard_page';
import ErrorPage from './error_page';

import routes from './routes';

class FullPage extends Component {
  render() {
    return (
      <div>
        <AppMenu/>

        <Container style={{ marginTop: "3.5em" }}>
          <Switch>
            {routes.map((route, idx) => {
              return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                <route.component {...props} />
              )} />)
                : (null);
            },
            )}
            <Redirect from="/" to="/dashboard" />
          </Switch>
        </Container>
      </div>
    );
  }
}

export default FullPage;