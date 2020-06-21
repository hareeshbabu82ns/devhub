import React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { Card, Image, Button } from 'semantic-ui-react'

const EntityCard = ({ data: { id, typeId, parentEntity, typeName, text } }) => {
  const history = useHistory()
  const match = useRouteMatch()

  return (
    <Card as={Link} to={`/${typeName}/${id}`}>
      <Image src={`https://picsum.photos/seed/${typeName}_${id}/250/250`} wrapped />
      <Card.Content>
        <Card.Header>{text}</Card.Header>
        <Card.Description>
        </Card.Description>
      </Card.Content>
      <Card.Content extra textAlign='right'>
        <Button icon='edit' basic size='tiny'
          onClick={(e) => {
            e.preventDefault()
            history.push(
              match.url + `?operation=editEntity` +
              `&parentEntity=${parentEntity ? parentEntity : ''}&entityId=${id}`)
          }} />
      </Card.Content>
    </Card>
  )
}

export default EntityCard