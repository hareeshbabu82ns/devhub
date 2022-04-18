import { Parser, TreeToGraphQL } from 'graphql-js-tree'
import { gql } from '@apollo/client'
import client from './GqlClient'

export function gqlParse( { code, libraries = '' } ) {
  const tree = Parser.parse( code, [], libraries )
  const parsed = TreeToGraphQL.parse( tree )
  // console.log( parsed )
  return parsed
}

const QUERY_FIND_ENTITY_BY_TYPE_TEXT = gql`
  query findEntity($type:EntityTypeEnum,$text:String){
    entities(by: { type: { value: $type }, 
      text: { path: "value", value: $text } }){
        id
        type
      }
  }
`
const QUERY_FETCH_ENTITY_TYPES = gql`
  query($language:String) {
    entityTypes{
      id
      name(language: $language)
      code
    }
  }
`
const MUTATION_CREATE_ENTITY = gql`
  mutation createEntity($data: EntityInput) {
    createEntity(withData: $data)
  }
`

export async function fetchAllEntityTypes( { language } ) {

  const { data } = await client.query( {
    query: QUERY_FETCH_ENTITY_TYPES,
    variables: {
      language
    }
  } )

  return data.entityTypes
}

export async function createEntity( { withData,
  checkExistance = true } ) {

  // console.log( 'createEntity: ', withData )

  const result = {
    existing: false,
    data: undefined,
  }

  if ( checkExistance ) {
    const { data: existingEntity } = await client.query( {
      query: QUERY_FIND_ENTITY_BY_TYPE_TEXT,
      variables: {
        type: withData?.type,
        text: withData.text[ 0 ].value
      }
    } )

    if ( existingEntity?.entities?.length > 0 ) {
      result.existing = true
      result.data = {
        id: existingEntity.entities[ 0 ].id,
        type: existingEntity.entities[ 0 ].type
      }
      return result
    }
  }
  // console.log( 'createEntity:(existing?) ', result )

  const { data } = await client.mutate( {
    mutation: MUTATION_CREATE_ENTITY,
    variables: { data: withData }
  } )

  result.data = {
    id: data.createEntity,
    type: withData.type
  }

  // console.log( 'createEntity: ', result )
  return result
}

export async function uploadSthotram( inputData ) {
  let parentResult
  // console.log( 'uploadSthotram: ' )

  if ( inputData?.parent ) {
    //create parent entity
    const textData = mapEntityTextLanguage( inputData.parent )
    parentResult = await createEntity( {
      withData: {
        type: inputData.parent.type || 'GOD',
        text: textData,
      },
      checkExistance: true
    } )
    // console.log( 'parent Entity: ', parentResult )
  }

  //create main entity
  if ( inputData?.entity ) {
    const textData = mapEntityTextLanguage( inputData.entity )

    const parentIDs = []
    if ( parentResult ) {
      parentIDs.push( {
        type: parentResult.data.type,
        entities: [ parentResult.data.id ]
      } )
    }

    const childEntities = mapContentTextToEntities( inputData?.contents )

    const { data } = await createEntity( {
      withData: {
        type: inputData.entity.type || 'STHOTRAM',
        text: textData,
        parentIDs,
        children: childEntities
      }
    } )

    // console.log( 'Entity Result: ', parentResult )
    return data
  }

}

export function mapEntityTextLanguage( data ) {
  const textData = []
  // let userTestStatus: { id: number, name: string }[] = []
  if ( data?.text )
    textData.push( { language: 'ENG', value: data.text } )

  if ( data?.textData ) {
    const texts = Object.keys( data.textData ).map( k => ( {
      language: k,
      value: data.textData[ k ]?.text
    } ) )
    textData.push( ...texts )
  }

  return textData
}

const LANGUAGES = [ 'SAN', 'TEL', 'IAST' ]

export function mapContentTextToEntities( data ) {
  const entities = []

  // const maxLen = 1
  const maxLen = data[ 'SAN' ]?.contents?.length

  for ( let i = 0; i < maxLen; i++ ) {
    const textData = []
    LANGUAGES.forEach( lang => {
      const t = data[ lang ]?.contents[ i ]
      if ( t )
        textData.push( {
          language: lang,
          value: t.replace( '\n', '  \n' )
        } )
    } );
    // console.log( textData )
    entities.push( {
      type: data?.type || 'SLOKAM',
      text: textData,
    } )
  }

  return entities
}