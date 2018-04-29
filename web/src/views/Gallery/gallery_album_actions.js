import React from 'react';

import { Label, Segment, Card, Image, Button, Icon } from "semantic-ui-react";

export default () => (
  <Segment pilled compact>
    <Label color="red" floating>9</Label>
    <Card >
      <Image src="http://mrg.bz/IxQIgC" />

      <Card.Content>
        <div id="rate" className="ui star rating right floated" data-rating="3"></div>
        <Card.Header>Animals</Card.Header>
        <Card.Meta>
          <span className="date"><Icon name="calendar" />Created 7/27/2014</span>
          <span className="right floated date"><Icon name="history" /> Modified 8/4/2014</span>
        </Card.Meta>
        <Card.Description>
          Different animals from around the world
        </Card.Description>
      </Card.Content>


      <Card.Content extra>
        <div className="ui right labeled button" data-content="Like it!" data-variation="tiny">
          <div className="ui red icon tiny button">
            <i className="thumbs outline up large icon"></i>
          </div>
          <a className="ui basic red left pointing label">365</a>
        </div>
        <div className="ui left labeled right floated button" data-content="Share it!" data-variation="tiny">
          <a className="ui basic red right pointing label">183</a>
          <div className="ui red icon tiny button">
            <i className="external share large icon"></i>
          </div>
        </div>
      </Card.Content>

    </Card>
  </Segment>
);