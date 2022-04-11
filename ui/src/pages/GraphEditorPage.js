import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { GraphEditor } from '../components/GraphEditor';
import axios from '../utils/GqlAxiosClient'
import { gqlParse } from '../utils/gql_utils';

export const GraphEditorPage = () => {

  const params = useParams()
  const { enqueueSnackbar } = useSnackbar()

  const [ schema, setSchema ] = useState( { code: '', libraries: '' } )
  const [ loading, setLoading ] = useState( false )

  const onSave = async ( schema ) => {
    // console.log( 'Saving Schema...', params.id, schema )
  }

  const onFetch = () => {
    // console.log( 'Loading Schema...', params.id )
    setLoading( true )
    axios
      .get( '/' )
      .then( ( res ) => {
        setSchema( { ...schema, code: gqlParse( { code: res.data } ) } )
        enqueueSnackbar( 'Schema Loaded' )
      } )
      .catch( () => {
        setSchema( { ...schema, code: '' } )
        enqueueSnackbar( 'Error Loading Schema', { variant: 'error' } )
      } )
      .finally( () => setLoading( false ) )
  }

  useEffect( () => {
    onFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ params ] )

  if ( schema?.code === '' ) return null

  return (
    <GraphEditor key={params?.id || 'new'}
      code={schema.code} libraries={schema.libraries}
      loading={loading} onSave={onSave} onRefetch={onFetch}
    />
  );
};

export default GraphEditorPage