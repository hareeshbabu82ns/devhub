import React from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { Card, Image, Button } from 'semantic-ui-react'

import { useRecoilValue } from 'recoil'
import settings from '../state/settings'

const EntityCard = ({ data: { id, typeId, parentEntity, typeName, text, defaultThumbnail } }) => {
  const history = useHistory()
  const match = useRouteMatch()
  const settingsData = useRecoilValue(settings)

  return (
    <Card as={Link} to={`/${typeName}/${id}`} className='entity' >
      <Image src={defaultThumbnail.replace('$text', text)} wrapped />
      <Card.Content>
        <Card.Header>{text}</Card.Header>
        <Card.Description>
        </Card.Description>
      </Card.Content>
      <Card.Content extra textAlign='right'>
        <Button icon='edit' basic size='tiny' inverted={settingsData.inverted}
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