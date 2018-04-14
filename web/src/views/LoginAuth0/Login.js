import React, { Component } from 'react';
import { Grid, Button, Card, Container, Icon } from 'semantic-ui-react';

class Login extends Component {
  login() {
    this.props.auth.login();
  }
  logout() {
    this.props.auth.logout();
  }
  render() {
    return (
      <Grid centered columns={4}>
        <Grid.Column>
          <Card fluid color='teal'>
            <Card.Content header='Login'/>
            <Card.Content description='Sign In using Auth0 Service' />
            <Card.Content extra>
              <Button.Group floated='right'>
              {/* <Icon name='user' /> */}
              <Button color="teal"
                          onClick={this.login.bind(this)}>
                          <Icon name='lock' />Login</Button>
              </Button.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
