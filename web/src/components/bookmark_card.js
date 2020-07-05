import React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { Card, Image, Button } from 'semantic-ui-react'

import { useRecoilValue } from 'recoil'
import settings from '../state/settings'

const BookmarkCard = ({ data: { id, entityId, text, typeName, parentId, parentTypeName, onDeleteClicked } }) => {
  const history = useHistory()
  const match = useRouteMatch()
  const settingsData = useRecoilValue(settings)

  return (
    <Card as={Link} to={`/${parentTypeName}/${parentId}?markedItem=${entityId}`} className='entity' >
      <Card.Content>
        <Card.Header>{text}</Card.Header>
        <Card.Description>
        </Card.Description>
      </Card.Content>
      <Card.Content extra textAlign='right'>
        <Button icon='delete' basic size='tiny' inverted={settingsData.inverted}
          onClick={(e) => {
            e.preventDefault()
            if (onDeleteClicked) onDeleteClicked(id)
          }} />
      </Card.Content>
    </Card>
  )
}

export default BookmarkCard