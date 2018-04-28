import React from 'react';

import { Card, Image, Button, Icon } from "semantic-ui-react";

export default () => (
  <Card
    image='http://mrg.bz/IxQIgC'
    header='God Name'
    meta='Sub Title'
    description='Extra Info'
    extra={(<div className="ui bottom attached basic buttons">
      <Button><Icon name="pencil" /></Button>
      <Button><Icon name="trash" /></Button>
    </div>)}
  />
  // <Card>
  //   <Image src="http://mrg.bz/IxQIgC" />
  //   <Card.Content>
  //     <Card.Header>giraffes.jpg</Card.Header>
  //     <Card.Meta>263 KB</Card.Meta>
  //   </Card.Content>
  //   <div className="ui bottom attached basic buttons">
  //     <Button><Icon name="pencil" /></Button>
  //     <Button><Icon name="trash" /></Button>
  //   </div>
  // </Card>
);