import React, { Component } from 'react';

import { Container, Menu, Icon } from "semantic-ui-react";
import { Router, Route, Switch, NavLink, Redirect } from "react-router-dom";

import { GRAPHQL_URL } from "./constants";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import logo from './logo.svg';
import './App.css';

import Callback from './views/Callback/Callback';
import Auth from './Auth/Auth';
import { AuthContext } from './Auth/AuthContext';
import history from './history';

import FullPage from './views/full-page';
import LoginAuth0 from './views/LoginAuth0/Login';

import ErrorPage from './views/error_page';


const auth = new Auth();

const apolloClient = new ApolloClient({
  uri: GRAPHQL_URL,
  request: async (operation) => {
    const token = localStorage.getItem('access_token');
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      }
    });
  },
});

const handleAuthentication = ({ location, successRoute }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication(successRoute);
  }
}

class App extends Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <AuthContext.Provider value={auth}>
          <Router history={history}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={(props) => (
                <LoginAuth0 auth={auth} {...props} />
              )} />
              {/* <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} /> */}
              <Route path="/callback" render={(props) => {
                handleAuthentication({ ...props, successRoute: '/' });
                return <Callback {...props} auth={auth} />
              }} />
              <Route path="/" name="Home" render={(props) => (
                !auth.isAuthenticated() ? (
                  <Redirect to="/login" />
                ) : (
                    <FullPage auth={auth} {...props} />
                  )
              )} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </ApolloProvider>
    );
  }
}

export default App;
