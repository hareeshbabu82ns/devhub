import { GraphQLClient, gql } from 'graphql-request';
import { DEVHUB_API_URL } from './constants';
import { EntityInput, EntityTypeEnum, getSdk, LanguageValueInput } from './generated/graphql_js';

import dotenv from 'dotenv'
import path from 'path';
import { readFile, readFileSync } from 'fs';

dotenv.config( {
  path: path.resolve( process.cwd(), '.env.local' )
} )

const devhubClient = new GraphQLClient( DEVHUB_API_URL );
const sdk = getSdk( devhubClient );

const LANGUAGES = [ 'SAN', 'TEL', 'IAST' ]

async function readSthotramFile( file: string ) {
  const contents = readFileSync( path.resolve( file ), { encoding: 'utf-8' } )
  return JSON.parse( contents )
}

function mapContentTextToEntities( data: any ): EntityInput[] {
  const entities: EntityInput[] = []

  // const maxLen = 1
  const maxLen = data[ 'SAN' ]?.contents?.length

  for ( let i = 0; i < maxLen; i++ ) {
    const textData: LanguageValueInput[] = []
    LANGUAGES.forEach( lang => {
      const t = data[ lang ]?.contents[ i ]
      if ( t )
        textData.push( {
          language: lang,
          value: t
        } )
    } );
    // console.log( textData )
    entities.push( {
      type: data?.type,
      text: textData,
    } )
  }

  return entities
}
function mapEntityTextLanguage( data: any ): LanguageValueInput[] {
  const textData: LanguageValueInput[] = []
  // let userTestStatus: { id: number, name: string }[] = []
  if ( data?.text )
    textData.push( { language: 'ENG', value: data.text } )

  if ( data?.textData ) {
    Object.keys( data.textData ).map( ( k: string ) => {
      // console.log( k, data.textData[ k ] )
      textData.push( {
        language: k,
        value: data.textData[ k ]?.text
      } )
    } )
  }

  return textData
}

async function createGod( withData: any ) {
  const textData = mapEntityTextLanguage( withData )

  // find if entity already exist
  const { data: existingEntity } = await sdk.getEntities( {
    by: {
      type: { value: EntityTypeEnum.God },
      text: { path: 'value', value: withData.textData[ 'SAN' ].text }
    }
  } )

  if ( existingEntity?.entities?.length > 0 )
    return existingEntity.entities[ 0 ].id

  const { data } = await sdk.createEntity( {
    withData: {
      type: EntityTypeEnum.God,
      text: textData,
    }
  } )

  return data.createEntity
}

async function createSthotram( { god: { } } ) {
  let god: any

  const inputData = await readSthotramFile( 'data/Uma_Maheshwara_Stotram.json' )

  if ( inputData?.parent?.type === 'GOD' ) {
    god = await createGod( inputData.parent )
    // console.log( god )
  }

  // create sthotram entity
  if ( inputData?.entity?.type === 'STHOTRAM' ) {
    const textData = mapEntityTextLanguage( inputData.entity )

    const childEntities = mapContentTextToEntities( inputData?.contents )
    // console.log( childEntities )

    const { data } = await sdk.createEntity( {
      withData: {
        type: EntityTypeEnum.Sthotram,
        text: textData,
        parentIDs: [ {
          type: EntityTypeEnum.God,
          entities: [ god ]
        } ],
        children: childEntities
      }
    } )

    // console.log( data )
    return data
  }

}


async function main() {

  console.log( 'uploading...' )

  await createSthotram( { god: {} } )

  // const { data } = await sdk.getEntities( { by: { type: { value: EntityTypeEnum.God } } } )

  // console.log( data );

  console.log( 'uploading finished' )
}


main();

