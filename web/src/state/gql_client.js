import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.NODE_ENV === 'production' ? '/graphql/' : 'http://localhost:8000/graphql/',
  })
});

export default client