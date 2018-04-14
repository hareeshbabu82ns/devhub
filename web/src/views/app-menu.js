import React, { Component } from 'react';
import { Container, Menu, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default ({ auth }) => (
  <Menu fixed="top" color="teal" inverted>
    <Container>
      <Menu.Item as="a" header>
        <Icon name="inr" />Devotional Hub
    </Menu.Item>
      <Menu.Item as={NavLink} to="/dashboard" exact>
        <Icon name="dashboard" />Dashboard
    </Menu.Item>
      <Menu.Item as={NavLink} to="/data">
        <Icon name="database" />Data
    </Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item name='logout' onClick={() => auth.logout('/login')} />
      </Menu.Menu>
    </Container>
  </Menu>
);