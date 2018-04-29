import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import history from '../history';

import { axiosAPI, axiosGQL } from '../axios';

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: AUTH_CONFIG.apiUrl,
    responseType: 'token id_token',
    scope: 'openid profile read:contents modify:contents'
  });

  userProfile;

  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication(successRoute = '/') {
    this.auth0.parseHash((err, authResult) => {
      console.log('Auth Err:', err);
      console.log('Auth Result:', authResult);
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult, successRoute);

        //set Authorization Header for Axios
        axiosAPI.defaults.headers.common['Authorization']
          = `Bearer ${authResult.accessToken}`;
        axiosGQL.defaults.headers.common['Authorization']
          = `Bearer ${authResult.accessToken}`;

        history.replace(successRoute);
      } else if (err) {
        history.replace(successRoute);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  setSession(authResult, successRoute) {
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    history.replace(successRoute);
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  getProfile(cb) {
    let accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      if (cb)
        cb(err, profile);
    });
  }

  logout(successRoute = '/') {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;

    //remove Authorization Header for Axios
    axiosAPI.defaults.headers.common['Authorization'] = '';
    axiosGQL.defaults.headers.common['Authorization'] = '';

    // navigate to the home route
    history.replace(successRoute);
  }

  isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
