import {
  ApolloClient, InMemoryCache,
  HttpLink, ApolloLink, concat
} from "@apollo/client";
import config from './config'

const prepareApolloClient = ( {
  baseUrl = config.baseUrl, apiPath, headers = {} } ) => {
  console.log( 'preparing schema for ', apiPath );
  const httpLink = new HttpLink( { uri: `${baseUrl}${apiPath}` } )

  const connectionHeaderMiddleware = new ApolloLink( ( operation, forward ) => {
    // add connection name http header before each request
    operation.setContext( ( { headers = {} } ) => ( {
      headers: {
        ...headers,
      }
    } ) )
    return forward( operation )
  } )

  const client = new ApolloClient( {
    cache: new InMemoryCache(),
    link: concat( connectionHeaderMiddleware, httpLink ),
  } );
  return client;
}

const client = prepareApolloClient( {
  apiPath: `${config.gqlPath}`
} )
// new ApolloClient({
//   uri: `${config.baseUrl}${config.gqlPath}${config.gqlAdminPath}?sap-client=${config.sapClient}`
// })

export { client as default, prepareApolloClient }
