import React from "react";
import { Grid } from "semantic-ui-react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

import CardGod from './Gallery/card_god';

const GET_GOD_BY_ID = gql`
  query god($id: String!){
    god(id : $id) {
      id
      title
      image
      items
    }
  }
`;

class GodEditPage extends React.Component {
  render() {
    return (
      <div style={{ marginTop: "4.5em" }}>
        <Query query={GET_GOD_BY_ID} variables={{ id: this.props.id }}>
          {({ loading, error, data: { god } }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;
            return (
              <CardGod  {...god} key={idx} />
            );
          }}
        </Query>
      </div>
    )
  }
};

export default GodEditPage;
