import React from 'react';

import { Label, Segment, Card, Image, Button, Icon } from "semantic-ui-react";

export default (props) => (
  <Segment piled>
    <Label color="grey" floating>{props.items}</Label>
    <Card link>
      <Image src={props.image} wrapped={true} />

      <Card.Content>
        <Card.Header>{props.title}</Card.Header>
      </Card.Content>
    </Card>
  </Segment>
);