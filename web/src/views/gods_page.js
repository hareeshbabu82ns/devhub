import React from "react";
import { Grid } from "semantic-ui-react";

import { axiosGQL } from '../axios';

import CardGod from './Gallery/card_god';

class GodsPage extends React.Component {
  state = { gods: [] };

  componentWillMount() {
    this.fetchGods();
  }

  fetchGods() {
    // axios.get(`/gods`)
    //   .then(response => this.setState({ gods: response.data.gods }))
    //   .catch(error => this.setState({ gods: [] }));
    axiosGQL.post('/', {
      "operationName": null,
      "variables": null,
      "query": "{gods{id title image items}}"
    })
      .then(response => this.setState({ gods: response.data.data.gods }))
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
    return (
      <div style={{ marginTop: "4.5em" }}>
        <Grid>
          {
            this.state.gods && this.state.gods.map((god, idx) => (
              <Grid.Column computer={4} tablet={6} mobile={8} stretched textAlign="center">
                <CardGod  {...god} key={idx} />
              </Grid.Column>
            ))
          }
        </Grid>
      </div>
    )
  }
};

export default GodsPage;
