import React from "react";
import { Grid } from "semantic-ui-react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import { axiosGQL } from '../axios';

import CardGod from './Gallery/card_god';

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

class GodsPage extends React.Component {
  render() {
    return (
      <div style={{ marginTop: "4.5em" }}>
        <Query query={GET_GODS}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return (
              <Grid>
                {
                  data.gods.map((god, idx) => (
                    <Grid.Column computer={4} tablet={6} mobile={8} stretched textAlign="center" key={idx}>
                      <CardGod  {...god} image={`${god.image}/${god.title}`} onClick={() => { this.props.history.push(`/gods/${god.id}/items`) }} />
                    </Grid.Column>
                  ))
                }
              </Grid>
            );
          }}
        </Query>
      </div>
    )
  }
};

export default GodsPage;
