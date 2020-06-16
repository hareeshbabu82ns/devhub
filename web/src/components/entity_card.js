import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image } from 'semantic-ui-react'

const EntityCard = ({ data: { id, typeId, typeName, text } }) => (
  <Card as={Link} to={`/${typeName}/${id}`}>
    <Image src={`https://picsum.photos/seed/${typeName}_${id}/250/250`} wrapped />
    <Card.Content>
      <Card.Header>{text}</Card.Header>
      <Card.Description>
      </Card.Description>
    </Card.Content>
  </Card>
)

export default EntityCard