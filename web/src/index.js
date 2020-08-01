import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloProvider } from '@apollo/client';

import { RecoilRoot } from 'recoil'

import client from './state/gql_client'

import { MediaContextProvider } from './utils/media_context'

ReactDOM.render(
  <React.StrictMode>
    <MediaContextProvider>
      <RecoilRoot>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </RecoilRoot>
    </MediaContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
