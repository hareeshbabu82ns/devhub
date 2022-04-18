import React, { Fragment, useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { Button, Grid, Stack } from '@mui/material'
import Panel from '../components/utils/Panel'
import { useQuery, gql } from '@apollo/client'
import { C_LANGUAGE_DEFAULT } from '../constants'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { entityTypesState } from '../state/entityTypes'
import { FormInputDropdown } from '../components/FormInput/FormInputDropdown'

const QUERY_GET_ENTITIES_BY_ID = gql`
  query($id:ID, $language:String) {
    entities(by:{id:{value:$id}}){
      id
      type
      text(language: $language)
    }
  }
`

const EntityCRUDPage = () => {

  const params = useParams()
  const [ searchParams ] = useSearchParams()

  const { loading, error, data, refetch } = useQuery( QUERY_GET_ENTITIES_BY_ID,
    {
      variables: {
        language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT,
        id: params.id
      }
    } )

  const onReset = async () => {
    await refetch()
  }

  const onSubmit = async ( data ) => {
    // await onSubmit(data)
    //   .then(() => form.reset(data))
    //   .catch((err) => console.error(err))
    console.log( 'onSubmit: ', data )
  }

  return (
    <EntityFormWrapper entity={data?.entities[ 0 ] || defaultEntity}
      key={data?.entities[ 0 ]?.id || 0}
      {...{ loading, error: params.id ? error : undefined, onReset, onSubmit }} />
  )
}
const defaultEntity = { id: 0, type: '' }

const EntityFormWrapper = ( { entity, onSubmit, loading, error, onReset } ) => {

  const validationSchema = Yup.object().shape( {
    type: Yup.string().required( 'Entity Type is required' ),
  } )

  const form = useForm( {
    mode: 'onSubmit',
    defaultValues: entity,
    resolver: yupResolver( validationSchema )
  } )

  const { handleSubmit, reset, formState: { isSubmitting } } = form

  const [ searchParams ] = useSearchParams()

  const entityTypesLoadable = useRecoilValueLoadable( entityTypesState( searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT ) )

  const actionsRight = (
    <Stack direction="row" spacing={2} >
      <Button onClick={handleSubmit( onSubmit )} variant={"contained"} disabled={isSubmitting}>
        Submit
      </Button>
      <Button onClick={() => reset()} variant={"outlined"}>
        Reset
      </Button>
    </Stack>
  )

  return (
    <Panel title={`Entity Form: ${entity.id ? entity.text : 'new'}`}
      loading={loading || entityTypesLoadable.state === 'loading'}
      error={error}
      sx={{ border: 0, m: 2 }}
      actionsRight={actionsRight} >
      <EntityForm entityTypes={entityTypesLoadable.contents} {...{ onSubmit, form }} />
    </Panel>
  )

}

const EntityForm = ( { form, onSubmit, entityTypes } ) => {
  // ref https://www.bezkoder.com/react-hook-form-material-ui-validation/
  const { formState, control, handleSubmit, setValue } = form
  const { errors, isSubmitting } = formState

  return (
    <form onSubmit={handleSubmit( onSubmit )}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={12}>
          <FormInputDropdown
            name="type"
            control={control}
            label="Entity Type"
            options={entityTypes.map( e => ( { label: e.name, value: e.code } ) )}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default EntityCRUDPage