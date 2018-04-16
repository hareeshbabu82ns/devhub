import React, { Component } from 'react';
import { Segment, Header, Image, Form } from "semantic-ui-react";

import { withAuth } from '../Auth/AuthContext';

class Profile extends Component {
  componentWillMount() {
    this.setState({ profile: {} });
    const { userProfile, getProfile } = this.props.auth;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }
  render() {
    const { profile } = this.state;
    return (
      <div>
        <Header as='h3' attached='top'>
          Profile: {profile.nickname}
        </Header>
        <Segment attached>
          <Form>
            <Form.Input label='eMail' type='text' value={profile.name} />
            <Form.Input label='Nick Name' type='text' value={profile.nickname} />
          </Form>
        </Segment>
      </div>
    );
  }
}

export default withAuth(Profile);