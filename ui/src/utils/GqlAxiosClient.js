import axios from "axios"
import config from './config'

const prepareAxiosClient = ( {
  baseUrl = config.baseUrl, apiPath } ) => {
  console.log( 'preparing schema for ', apiPath );
  const client = axios.create( {
    baseURL: `${baseUrl}${apiPath}`
  } )
  return client;
}

const client = prepareAxiosClient( {
  apiPath: `${config.gqlPath}`
} )

export { client as default, prepareAxiosClient }
