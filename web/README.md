# Devotional Hub
Project to view and maintain Devotional Content (Text, Audio and Video).

### Composition
* uses [Auth0](http://auth0.com) to authenticate
* need to update **auth0-variables.js** to work with auth0 service
* initialized with **create-react-app**
* uses **semantic-ui-react** for UI



#### GraphQL usage
* using axios
```javascript
  import { axiosGQL } from '../axios';

  axiosGQL.post('/', {
    "operationName": null,
    "variables": null,
    "query": "{gods{id title image items}}"
  })
    .then(response => this.setState({ gods: response.data.data.gods }))
    .catch(error => this.setState({ message: error.message }));
```
* using react-apollo
```javascript
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_GODS = gql`
  {
    gods {
      id
      title
      image
      items
    }
  }
`;
const Gods = () => (
  <Query query={GET_GODS}>
    {({ loading, error, data }) => {
      if (error) return <Error />
      if (loading || !data) return <Fetching />

      return <GodList gods={data.gods} />
    }}
  </Query>
)
```