import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Checkbox, Message, Menu, Search, Icon, Segment, Form, Divider } from 'semantic-ui-react'
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client';
import { useRecoilValue } from 'recoil'
import { toast } from 'react-toastify'
import _ from 'lodash'

import settings from '../state/settings'
import user from '../state/user'
import { baseTypes } from '../state/base_types'

const SettingsForm = ({ onSubmitClicked, handleClose }) => {
  const settingsData = useRecoilValue(settings)
  const userData = useRecoilValue(user)
  const { entityTypes, languages } = useRecoilValue(baseTypes)

  const languageOptions = [{ id: '0', text: ' ', value: '0' },
  ...languages.map(language => ({ text: language.iso, value: language.id, id: language.id }))]

  const defaultValues = {
    language: settingsData.language,
    meaningLanguage: settingsData.meaningLanguage,
    inverted: settingsData.inverted,
    fontSize: settingsData.fontSize
  }
  const { handleSubmit, register, control, errors, reset, formState, setValue } = useForm({
    defaultValues
  })
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
    language: {
      required: { value: true, message: 'Language is required' }
    },
    meaningLanguage: {
      required: { value: true, message: 'Meaning Language is required' }
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} inverted={settingsData.inverted}>
      <Form.Group widths='equal'>
        <Controller as={Form.Select} control={control} name='language'
          fluid label='Language' placeholder='Language' required
          options={languageOptions}
          onChange={([_, { value }]) => value}
        />
        <Controller as={Form.Select} control={control} name='meaningLanguage'
          fluid label='Meaning Language' placeholder='Meaning Language' required
          options={languageOptions}
          onChange={([_, { value }]) => value}
        />
      </Form.Group>
      <Form.Group widths='equal'>
        <Controller as={Form.Checkbox} control={control} name='inverted'
          label='Dark Mode' placeholder='Dark Mode'
          onChange={([_, { checked }]) => checked}
        />
        <Controller as={Form.Input} control={control} name='fontSize' type='number'
          label='Font Size' placeholder='Font Size'
        />
      </Form.Group>
      <Divider />
      <Form.Group style={{ justifyContent: 'flex-end' }} >
        <Form.Button secondary onClick={handleClose}
          inverted type='button'>
          <Icon name='arrow left' /> Close
              </Form.Button>
        <Form.Button secondary onClick={() => reset(defaultValues)}
          inverted type='reset' disabled={!formState.dirty}>
          <Icon name='undo' /> Reset
              </Form.Button>
        <Form.Button color='green' inverted disabled={!formState.dirty} loading={wipSubmit}>
          <Icon name='save' /> Save
              </Form.Button>
      </Form.Group>
    </Form>
  )
}

export default SettingsForm


