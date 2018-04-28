import React, { Component } from 'react';
import { Container, Menu, Icon, Dropdown, Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

import { withAuth } from '../Auth/AuthContext';

const userDropdownTrigger = ({ nickname, picture }) => (
  <span>
    <Image avatar src={picture} /> {nickname}
  </span>
);
class AppMenu extends React.Component {
  logout = () => {
    this.props.auth.logout('/');
  }
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
    const { auth } = this.props;
    const { profile } = this.state;
    return (
      <Menu fixed="top" color="teal" inverted size='tiny'>
        <Container>
          <Menu.Item as="a" header>
            <Icon name="inr" />Devotional Hub
          </Menu.Item>
          <Menu.Item as={NavLink} to="/dashboard" exact>
            <Icon name="dashboard" />Dashboard
          </Menu.Item>
          <Menu.Item as={NavLink} to="/gods">
            <Icon name="book" />Gods
          </Menu.Item>
          <Menu.Item as={NavLink} to="/markdown">
            <Icon name="book" />Markdown
          </Menu.Item>
          <Menu.Menu position='right'>
            {(profile) ?
              (<Dropdown item
                trigger={userDropdownTrigger(profile)}
                pointing='top right' icon={null}>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={this.logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>) : null}
          </Menu.Menu>
        </Container>
      </Menu>
    )
  };
}

export default withAuth(AppMenu);