import React from "react";
import { Grid } from "semantic-ui-react";

import axios from '../axios';

import CardGod from './Gallery/card_god';

const GODS = [
  {
    title: "Sri Ganesh",
    image: "https://source.unsplash.com/random/150x120",
    items: 3
  },
  {
    title: "Sri Rama",
    image: "https://source.unsplash.com/random/150x120",
    items: 0
  },
  {
    title: "Sri Gayathri Mata",
    image: "https://source.unsplash.com/random/150x120",
    items: 5
  },
  {
    title: "Sri Sai Ram",
    image: "https://source.unsplash.com/random/150x120",
    items: 5
  },
  {
    title: "Sri Lakshmi matha Ji Ki Jai",
    image: "https://source.unsplash.com/random/150x120",
    items: 5
  },
  {
    title: "Sri Saraswathi Mata",
    image: "https://source.unsplash.com/random/150x120",
    items: 5
  }
];

class GodsPage extends React.Component {

  componentWillMount() {
    this.setState({ gods: GODS });
    this.fetchGods();
  }

  fetchGods() {
    // axios.get(`/gods`)
    //   .then(response => this.setState({ gods: response.data.gods }))
    //   .catch(error => this.setState({ gods: [] }));
  }

  render() {
    return (
      <div style={{ marginTop: "4.5em" }}>
        <Grid>
          {
            this.state.gods.map((god, idx) => (
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
