import React, { useState, useEffect } from 'react'
import { useForm, Controller } from "react-hook-form";
import { Container, Message, Icon, Segment, Form, Divider, Table, Tab } from 'semantic-ui-react'
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client';
import { useRecoilValue } from 'recoil'
import { toast } from 'react-toastify'
import _ from 'lodash'

import settings from '../state/settings'
import { baseTypes } from '../state/base_types'

// const ContentLineForm = (props) => {
//   const [languageId, setLanguage] = useState(0)
//   const { loading, error, data, refetch } = useQuery(FETCH_CONTENT, {
//     variables: { parent: props.parentEntity, language: languageId }, skip: languageId === 0
//   });

//   if (loading)
//     return <Segment loading placeholder />
//   if (error)
//     return <Segment placeholder>Error loading Content {props.entityId}</Segment>

//   return (
//     <InnerForm {...props} contentData={_.get(data, 'contentMeanings[0]', {})} refetch={refetch} />
//   )
// }

// const InnerForm = ({ onSubmitClicked, onDeleteClicked, handleClose,
//   entityId, parentEntity, contentData, refetch }) => {

const ContentMeaningForm = ({ handleClose,
  entityId, parentEntity }) => {
  const { query } = useApolloClient()
  const [languageId, setLanguage] = useState('0')

  const [updateContent, { data: updatedContent }] = useMutation(UPDATE_CONTENT_MEANING)
  const [deleteContent, { data: deletedContent }] = useMutation(DELETE_CONTENT_MEANING)

  const settingsData = useRecoilValue(settings)
  const { entityTypes, languages } = useRecoilValue(baseTypes)

  const languageOptions = [{ id: '0', text: ' ', value: '0' },
  ...languages.map(language => ({ text: language.iso, value: language.id, id: language.id }))]

  const defaultValues = {
    id: '0',
    content: '',
    language: languageId,
    parent: entityId,
  }

  const formMethods = useForm({
    defaultValues
  })
  const { handleSubmit, register, control, errors, reset, formState, getValues, setValue } = formMethods

  useEffect(() => {
    if (languageId === '0') {
      setValue('content', '')
      setValue('language', languageId)
      return
    }
    console.log('lang selected', languageId)
    query({
      query: FETCH_CONTENT_MEANING,
      variables: { parent: entityId, language: languageId }
    }).then((res) => {
      console.log('result', res.data)
      setValue('content', _.get(res, 'data.contentMeanings[0].content', ''))
      setValue('id', _.get(res, 'data.contentMeanings[0].id', ''))
      setValue('language', languageId)
    })
  }, [languageId])


  const [wipSubmit, setWipSubmit] = useState(false)

  const onDeleteClicked = async (id) => {
    await deleteContent({ variables: { id } })
    toast(<Message success header='Content deleted' />)
  }
  const onSubmitClicked = async (withData) => {
    await updateContent({ variables: { withData } })
    toast(<Message success header='Content updated' />)
  }

  const onSubmit = async (data) => {
    console.log(data)
    const withData = {
      parentEntity: data.parent,
      content: data.content,
      language: languageId,
    }
    if (onSubmitClicked) {
      setWipSubmit(true)
      await onSubmitClicked(withData)
      setWipSubmit(false)
    }
  }

  const validations = {
    content: {
      required: { value: true, message: 'Content is required' },
      minLength: { value: 30, message: 'min length 30' }
    },
    language: {
      required: { value: true, message: 'Language is required' }
    }
  }


  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group widths='equal'>
        <input type='text' ref={register} name='id' hidden />
        <input type='text' ref={register} name='parent' hidden />
        <Form.Select name='language'
          label='Language' placeholder='Language' required
          value={languageId}
          options={languageOptions}
          onChange={(e, { value }) => {
            setLanguage(value)
          }}
        />
      </Form.Group>
      {
        <Form.Group widths='equal'>
          <Controller as={Form.TextArea} control={control} name='content'
            required label='Content (Markdown)' placeholder='Content (Markdown)'
            error={errors.content && errors.content.message}
            rows='25'
          />
        </Form.Group>
      }
      <Divider />
      <Form.Group style={{ justifyContent: 'flex-end' }} >
        <Form.Button color='red' onClick={() => onDeleteClicked(getValues('id'))}
          inverted type='button' disabled={!entityId || languageId === '0'}>
          <Icon name='delete' /> Delete Content
        </Form.Button>
        <Form.Button secondary onClick={handleClose}
          inverted type='button'>
          <Icon name='arrow left' /> Close
        </Form.Button>
        <Form.Button secondary onClick={() => reset(defaultValues)}
          inverted type='reset' disabled={!formState.dirty}>
          <Icon name='undo' /> Reset
        </Form.Button>
        <Form.Button color='green' disabled={!formState.dirty || !entityId || languageId === '0'} inverted loading={wipSubmit}>
          <Icon name='save' /> Save Content
        </Form.Button>
      </Form.Group>
    </Form>
  )
}

export default ContentMeaningForm


const FETCH_CONTENT_MEANING = gql`
query GetContentMeaningsOfEntity($parent:ID!,$language:ID!){
  contentMeanings(by:{parent:$parent,language:$language}){
    id
    language{
      id
    }
    content
  }
}
`;
const UPDATE_CONTENT_MEANING = gql`
mutation UpdateContentMeaning($withData:ContentMeaningInput){
  updateContentMeaning(withData:$withData){
    id
    language{
      id
    }
    content
  }
}
`;
const DELETE_CONTENT_MEANING = gql`
mutation DeleteContentMeaning($id:ID!){
  deleteContentMeaning(id:$id)
}
`;