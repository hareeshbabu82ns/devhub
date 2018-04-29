import React from "react";
import { Grid } from "semantic-ui-react";

import { axiosAPI, axiosGQL } from '../axios';

import GalleryItemActions from './Gallery/gallery_item_actions';
import GalleryAlbumActions from './Gallery/gallery_album_actions';

class DashboardPage extends React.Component {
  componentWillMount() {
    this.setState({ message: '' });
  }

  render() {
    return (
      <div>

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
