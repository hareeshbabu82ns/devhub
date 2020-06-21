import React from 'react'
import { Message, Segment } from 'semantic-ui-react'
import { useQuery, useMutation, gql } from '@apollo/client';
import _ from 'lodash'

import { toast } from 'react-toastify'

import EntityForm from './entity_form'

const EntityModalContent = (props) => {

  const entityId = props.entityId ? props.entityId : 0
  const { loading, error, data } = useQuery(FETCH_ENTITY, {
    variables: { by: { id: props.entityId } }, skip: entityId === 0
  });

  const [updateEntity, { data: updatedEntity }] = useMutation(UPDATE_ENTITY)
  const [deleteEntity, { data: deletedEntity }] = useMutation(DELETE_ENTITY)

  const onSave = async (data) => {
    const newData = normalizeEntityDataToSubmit(data)
    console.log('form submitted with: ', newData)
    await updateEntity({ variables: { ...newData } })
    toast(<Message success header='Entity updated' />)
    // refetch();
  }

  const onDelete = async (id) => {
    await deleteEntity({ variables: { id } })
    toast(<Message success header='Entity deleted' />)
    // refetch();
  }

  const normalizeEntityDataToSubmit = (data) => {
    const newData = {
      id: data.id ? data.id : '',
      entityData: {
        parentId: data.parent,
        type: data.type,
        defaultText: data.defaultText,
        textData: data.textData.map(textData => ({
          language: textData.language,
          text: textData.text, description: textData.description
        }))
      }
    }
    return newData
  }

  if (loading)
    return <Segment loading placeholder />
  if (error)
    return <Segment placeholder>Error loading Entity {entityId}</Segment>

  return (
    <EntityForm {...props} entityData={_.get(data, 'entities[0]')}
      onSubmitClicked={onSave} onDeleteClicked={onDelete} />
  )
}

const FETCH_ENTITY = gql`
query getEntity($by:EntitiesBy!) {
  entities(by:$by) {
    id
    defaultText
    defaultThumbnail
    type{
      id
    }
    textData{
      id
      language{
        id
        iso
      }
      text
      description
    }
  }
}
`;
const UPDATE_ENTITY = gql`
mutation updateEntity($id: ID, $entityData: EntityContentInput!) {
  updateEntityContent(id:$id, withData: $entityData) {
    id
    defaultText
    defaultThumbnail
    textData{
      id
      text
      description
    }
  }
}
`;
const DELETE_ENTITY = gql`
mutation deleteEntity($id: ID!) {
  deleteEntity(id:$id)
}
`;

export default EntityModalContent