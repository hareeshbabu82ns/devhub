import React from "react";
import { Grid } from "semantic-ui-react";

import axios from '../axios';

import GalleryItemActions from './Gallery/gallery_item_actions';
import GalleryAlbumActions from './Gallery/gallery_album_actions';

class DashboardPage extends React.Component {
  componentWillMount() {
    this.setState({ message: '' });
    this.fetchMessage();
  }

  fetchMessage() {
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

        <div id="album">
          <GalleryAlbumActions />
        </div>

        <div id="album_items">

          <div class="ui cards" style={{ margin: '10px' }}>
            <GalleryItemActions />
          </div>

        </div>

      </div>
    )
  }
};

export default DashboardPage;
