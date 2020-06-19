import React, { useState, useEffect } from 'react'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { Container, Menu, Icon, Segment, Form, Divider, Table, Button } from 'semantic-ui-react'
import { useRecoilValue } from 'recoil'
import _ from 'lodash'

import settings from '../state/settings'
import { baseTypes } from '../state/base_types'

const EntityForm = ({ onSubmitClicked, onDeleteClicked, handleClose,
  entityId, parentEntity, createType, entityData }) => {

  const settingsData = useRecoilValue(settings)
  const { entityTypes, languages } = useRecoilValue(baseTypes)

  const fillLanguagesTextData = (currTextData, languages) => {
    const newTextData = []
    languages.forEach((language) => {
      const textData = currTextData.find((textData) => textData.language.id === language.id)
      if (textData)
        newTextData.push({ ...textData, language: language.id, languageISO: language.iso })
      else
        newTextData.push({
          id: `new_${newTextData.length + 1}`,
          language: language.id, languageISO: language.iso,
          text: '', description: ''
        })
    })
    return newTextData
  }
  const defaultValues = {
    id: _.get(entityData, 'id', ''),
    defaultText: _.get(entityData, 'defaultText', ''),
    type: _.get(entityData, 'type.id', createType),
    parent: _.get(entityData, 'parent.id', parentEntity),
    textData: fillLanguagesTextData(_.get(entityData, 'textData', []), languages)
  }


  const { handleSubmit, register, control, errors, reset, formState, getValues } = useForm({
    defaultValues
  })

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "textData", // unique name for your Field Array
      // keyName: "language", //default to "id", you can change the key name
    }
  );

  const [wipSubmit, setWipSubmit] = useState(false)

  const onSubmit = async (data) => {
    console.log(data)
    if (onSubmitClicked) {
      setWipSubmit(true)
      await onSubmitClicked(data)
      setWipSubmit(false)
    }
  }

  const validations = {
    defaultText: {
      required: { value: true, message: 'Default Text is required' },
      minLength: { value: 5, message: 'min length 5' }
    },
    type: {
      required: { value: true, message: 'Entity Type is required' }
    }
  }

  return (
    <Container fluid>
      <Menu attached='top'>
        <Menu.Item>
          <Menu.Header as='h4' content={'Entity'}></Menu.Header>
        </Menu.Item>
      </Menu>
      <Segment attached='bottom'>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group widths='equal'>
            <input type='text' ref={register} name='id' hidden />
            <Controller as={Form.Select} control={control} name='type'
              fluid label='Type' placeholder='Type' required
              options={entityTypes.map(entityType => ({ text: entityType.name, value: entityType.id, id: entityType.id }))}
              onChange={([_, { value }]) => value}
            />
            <Controller as={Form.Input} control={control} name='parent'
              readOnly fluid
              label='Parent Entity' placeholder='Parent Entity'
            // options={lanes.map(lane => ({ text: lane.title, value: lane.id, id: lane.id }))}
            // onChange={([_, { value }]) => value}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Controller as={Form.Input} control={control} name='defaultText'
              fluid required label='Default Text' placeholder='Default Text'
              rules={validations.defaultText} error={errors.defaultText && errors.defaultText.message}
            />
          </Form.Group>
          <Table striped stackable>
            <Table.Body>
              {fields.map((field, index) => (
                <Table.Row key={field.id}>
                  <Table.Cell>
                    <Form.Group>
                      <input type='text' name={`textData[${index}].id`} ref={register} hidden />
                      <input type='text' name={`textData[${index}].language`} ref={register} hidden />
                      <Controller as={Form.Input} control={control} name={`textData[${index}].languageISO`}
                        label='Language' placeholder='Language' required readOnly fluid
                      />
                      <Controller as={Form.Input} control={control} name={`textData[${index}].text`}
                        fluid label='Text' placeholder='Text' width={4}
                      />
                      <Controller as={Form.TextArea} control={control} name={`textData[${index}].description`}
                        label='Description' placeholder='Description' lines='3' width={10}
                      />
                    </Form.Group>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Divider />
          <Form.Group style={{ justifyContent: 'flex-end' }} >
            <Form.Button color='red' onClick={() => onDeleteClicked(entityId)}
              inverted type='button' disabled={!entityId}>
              <Icon name='delete' /> Delete
            </Form.Button>
            <Form.Button secondary onClick={() => reset(defaultValues)}
              inverted type='reset' disabled={!formState.dirty}>
              <Icon name='redo' /> Clear
            </Form.Button>
            <Form.Button color='green' inverted disabled={!formState.dirty} loading={wipSubmit}>
              <Icon name='save' /> Save
            </Form.Button>
          </Form.Group>
        </Form>
      </Segment>
    </Container>
  )
}

export default EntityForm