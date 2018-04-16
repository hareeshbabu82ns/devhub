import React from "react";
import { Grid } from "semantic-ui-react";

import axios from '../axios';

class DashboardPage extends React.Component {
  componentWillMount() {
    this.setState({ message: '' });
    this.fetchMessage();
  }

  fetchMessage(){
    // const { getAccessToken } = this.props.auth;
    // console.log("Token:",getAccessToken());
    // const headers = { 'Authorization': `Bearer ${getAccessToken()}`}
    axios.get(`/private`)
      .then(response => this.setState({ message: response.data.message }))
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
  return (
  <div>
    Dashboard :{this.state.message}
  </div>
  )
  }
};

export default DashboardPage;
