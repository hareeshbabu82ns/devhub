
const config = {
  baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '',
  gqlPath: '/graphql',
}

export default config;