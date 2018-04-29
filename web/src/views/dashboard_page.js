import React from "react";
import { Grid } from "semantic-ui-react";

import { axiosAPI, axiosGQL } from '../axios';

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

    // axiosAPI.get(`/private`)
    //   .then(response => this.setState({ message: response.data.message }))
    //   .catch(error => this.setState({ message: error.message }));

    let query = `{
      god(id:"5ae4f2f111445ed7e9eff33e"){
        id
        title
        image
        items
      }
      godByTitle(title:"Sri Rama"){
        title
        image
        items
      }
      gods{
        id
        title
        image
        items
      }
    }`;
    axiosGQL.post('/', {
      "operationName": null,
      "variables": null,
      query
    })
      .then(response => this.setState({ message: response.data }))
      .catch(error => this.setState({ message: error.message }));

  }

  render() {
    return (
      <div>
        Dashboard :{JSON.stringify(this.state.message)}

        <div id="album">
          <GalleryAlbumActions />
        </div>

        <div id="album_items">

          <div className="ui cards" style={{ margin: '10px' }}>
            <GalleryItemActions />
          </div>

        </div>

      </div>
    )
  }
};

export default DashboardPage;
