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

async function readGhattamFile( file: string ) {
  const contents = readFileSync( path.resolve( file ), { encoding: 'utf-8' } )
  return JSON.parse( contents )
}

async function createEntity( withData?: EntityInput, checkExisting: Boolean = true ) {

  // console.log( 'createEntity: with: ', withData )

  if ( checkExisting ) {
    // find if entity already exist
    const { data: existingEntity } = await sdk.getEntities( {
      by: {
        type: { value: withData?.type },
        text: { path: 'value', value: withData?.text?.find( e => !e?.value?.startsWith( '$trans' ) )?.value }
      }
    } )

    if ( existingEntity?.entities?.length > 0 )
      return existingEntity.entities[ 0 ].id
  }


  const { data } = await sdk.createEntity( {
    withData
  } )

  return data.createEntity
}

async function main( argv: any ) {

  console.log( 'uploading from folder ...', argv.directory ) // ./data/pothana_bhagavatham

  const skandamList = [ '1', '2', '3', '4', '5.1', '5.2', '6', '7', '8', '9', '10.1', '10.2', '11', '12' ]

  // create or fetch god
  const godId = await createEntity( {
    type: EntityTypeEnum.God,
    text: [ { language: 'SLP1', value: 'vizRu' } ]
  }, true )

  // create puranam
  const puranamId = await createEntity( {
    type: EntityTypeEnum.Puranam,
    text: [ { language: 'SLP1', value: 'potana BAgavatamu' },
    { language: 'TEL', value: '$transliterateFrom=SLP1' },
    { language: 'SAN', value: '$transliterateFrom=SLP1' } ],
    parentIDs: [ { type: EntityTypeEnum.God, entity: godId } ]
  }, true )

  for ( const skandamFileNumber of skandamList ) {

    let skandamId = ''

    for ( let ghattamFileNumber = 1; ghattamFileNumber < 200; ghattamFileNumber++ ) {

      let inputData: any

      try {
        inputData = await readGhattamFile( `${argv.directory}/skandam_${skandamFileNumber}_ghattam_${ghattamFileNumber}.json` )
      } catch ( e ) {
        break // the ghattam loop
      }

      // create skandam
      skandamId = ghattamFileNumber === 1 ? await createEntity( {
        type: EntityTypeEnum.Skandam,
        text: [ { language: 'TEL', value: inputData.kandaTitle },
        { language: 'SAN', value: '$transliterateFrom=TEL' } ],
        parentIDs: [ { type: EntityTypeEnum.Puranam, entity: puranamId } ]
      }, true ) : skandamId

      // // create slokams child data
      // const slokams: EntityInput[] = inputData.contents
      //   .filter( ( c: any ) => c?.slokam?.length > 0 )
      //   .map( ( c: any ) => ( {
      //     type: EntityTypeEnum.Slokam,
      //     text: [
      //       { language: 'TEL', value: c?.slokam?.replace( '\n', '  \n' ) },
      //       { language: 'SAN', value: '$transliterateFrom=TEL' } ],
      //   } ) )

      // create ghattam
      const ghattamId = await createEntity( {
        type: EntityTypeEnum.Ghattam,
        text: [ { language: 'TEL', value: inputData.sargaTitle },
        { language: 'SAN', value: '$transliterateFrom=TEL' } ],
        parentIDs: [ { type: EntityTypeEnum.Skandam, entity: skandamId } ],
        // children: slokams,
      }, false )
      // console.log( `skandam: ${skandamFileNumber} - ${skandamId}, ghattam: ${ghattamFileNumber} - ${ghattamId}, slokams: ${slokams.length}` )

      // create slokams
      for ( const c of inputData.contents ) {
        if ( c?.slokam?.length <= 0 ) continue
        const slokamId = await createEntity( {
          type: EntityTypeEnum.Slokam,
          text: [
            { language: 'TEL', value: c?.slokam?.replace( '\n', '  \n' ) },
            { language: 'SAN', value: '$transliterateFrom=TEL' },
            { language: 'SLP1', value: '$transliterateFrom=SAN' } ],
          parentIDs: [ { type: EntityTypeEnum.Ghattam, entity: ghattamId } ],
          audio: c?.audio,
          meaning: ( c?.tatparyam?.length > 0 ) ? [
            { language: 'TEL', value: c?.tatparyam?.replace( '\n', '  \n' ) },
          ] : [],
          attributes: ( c?.prati_pada_artham?.length > 0 ) ? [
            { key: 'each_word_meaning', value: c?.prati_pada_artham?.replaceAll( `\n`, '' ).replaceAll( ';', `  \n` ) || '' }
          ] : [],
        }, false )
        console.log( `skandam: ${skandamFileNumber} - ${inputData.kandaTitle}, ghattam: ${ghattamFileNumber} - ${inputData.sargaTitle}, slokam: ${slokamId}` )
      }

    }

  }


  console.log( 'uploading finished' )
}

import yargs from 'yargs/yargs'

const argv = yargs( process.argv.slice( 2 ) ).options( {
  directory: { type: 'string' },
} )
  .alias( 'd', 'directory' )
  .usage( '$0 --directory <json files directory>' )
  .parseSync()

main( argv );

  // yarn upload-pothana-bhagavatham -d '../loaders/data/pothana_bhagavatham/'