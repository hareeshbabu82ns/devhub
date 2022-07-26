import { GraphQLClient, gql } from 'graphql-request';
import { DEVHUB_API_URL, C_ENTITY_ATTR_MEANING } from './constants';
import { EntityInput, EntityTypeEnum, getSdk, LanguageValueInput, SanscriptScheme } from './generated/graphql_js';
import Sanscript from '@indic-transliteration/sanscript'

import dotenv from 'dotenv'
import path from 'path';
import { readFile, readFileSync } from 'fs';

dotenv.config( {
  path: path.resolve( process.cwd(), '.env.local' )
} )

const devhubClient = new GraphQLClient( DEVHUB_API_URL );
const sdk = getSdk( devhubClient );

async function readJSONFile( file: string ) {
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

const defaultTextData: LanguageValueInput[] = [
  { language: 'SLP1', value: '$transliterateFrom=SAN' },
  { language: 'IAST', value: '$transliterateFrom=SAN' },
  { language: 'TEL', value: '$transliterateFrom=SAN' },
]



async function main( argv: any ) {

  console.log( 'uploading from folder ...', argv.directory ) // ./data/valmiki_ramayan

  // const kandamList = [ 'baala', 'ayodhya', 'aranya', 'kish', 'sundara', 'yuddha' ]

  const kandamNamesList = await readJSONFile( `${argv.directory}/0_sarga_titles_san.json` )

  // create or fetch god
  const godId = await createEntity( {
    type: EntityTypeEnum.God,
    text: [ { language: 'SLP1', value: 'rAma' } ]
  }, true )

  // create puranam
  const puranamId = await createEntity( {
    type: EntityTypeEnum.Puranam,
    text: [
      { language: 'IAST', value: 'vālmīki rāmāyaṇam' },
      { language: 'SLP1', value: '$transliterateFrom=IAST' },
      { language: 'TEL', value: '$transliterateFrom=IAST' },
      { language: 'SAN', value: '$transliterateFrom=IAST' } ],
    parentIDs: [ { type: EntityTypeEnum.God, entity: godId } ]
  }, true )

  for ( const kandamNamesMap of kandamNamesList ) {

    const kandamFileNumber = kandamNamesMap.kandam

    let kandamId = ''

    for ( let sargaFileNumber = 1; sargaFileNumber < 2; sargaFileNumber++ ) {

      let inputData: any

      try {
        inputData = await readJSONFile( `${argv.directory}/${kandamFileNumber}_sarga_${sargaFileNumber}.json` )
      } catch ( e ) {
        break // the sarga loop
      }

      const sargaText = kandamNamesMap?.sargaTitles[ sargaFileNumber - 1 ]

      // create kandam
      // const textData = [ { language: 'ENG', value: inputData.kandaTitle } ]
      // const kdata = kandamNamesMap?.find( k => k?.kandam === kandamFileNumber )
      // kdata?.text?.forEach( t => textData.push( t ) )

      // create kandam
      const textData = [ { language: 'SAN', value: kandamNamesMap?.text } ]
      defaultTextData?.forEach( t => textData.push( t ) )

      kandamId = sargaFileNumber === 1 ? await createEntity( {
        type: EntityTypeEnum.Kaandam,
        text: textData,
        parentIDs: [ { type: EntityTypeEnum.Puranam, entity: puranamId } ]
      }, true ) : kandamId

      const children: EntityInput[] = inputData.contents
        .filter( ( c: any ) => c?.slokam?.length > 0 )
        .map( ( c: any, i: any ) => {
          const prati_pada_artham = c?.prati_pada_artham?.replaceAll( `\n`, '' )
            .split( ';' ).filter( ( e: String ) => e.length > 0 )
            .map( ( a: String ) => {
              const map = a.split( '=' ).map( e => e.trim() )
              const tel = Sanscript.t( map[ 0 ], 'iast', 'telugu' )
              return `${tel} ( ${map[ 0 ]} ) = ${map[ 1 ]}`
            } ).join( `  \n` ) || '';
          // const prati_pada_artham = c?.prati_pada_artham || '';

          return {
            type: EntityTypeEnum.Slokam,
            text: [
              { language: 'SAN', value: c?.slokam?.replace( '\n', '  \n' ) },
              { language: 'TEL', value: '$transliterateFrom=SAN' },
              { language: 'SLP1', value: '$transliterateFrom=SAN' },
            ],
            audio: c?.audio,
            meaning: ( c?.tatparyam?.length > 0 ) ? [
              { language: 'ENG', value: c?.tatparyam?.replace( '\n', '  \n' ) },
            ] : [],
            attributes: ( c?.prati_pada_artham?.length > 0 ) ? [
              { key: C_ENTITY_ATTR_MEANING, value: prati_pada_artham }
            ] : []
          }
        } )

      // create sarga
      const stextData = [ { language: 'SAN', value: sargaText }, { language: 'ENG', value: inputData.sargaTitle } ]
      defaultTextData?.forEach( t => stextData.push( t ) )
      const sargaId = await createEntity( {
        type: EntityTypeEnum.Sarga,
        text: stextData,
        parentIDs: [ { type: EntityTypeEnum.Kaandam, entity: kandamId } ],
        children,
      }, false )

      // // create slokams seperately
      // for ( const c of inputData.contents ) {
      //   if ( c?.slokam?.length <= 0 ) continue
      //   const slokamId = await createEntity( {
      //     type: EntityTypeEnum.Slokam,
      //     text: [
      //       { language: 'SAN', value: c?.slokam?.replace( '\n', '  \n' ) },
      //       { language: 'TEL', value: '$transliterateFrom=SAN' } ],
      //     parentIDs: [ { type: EntityTypeEnum.Sarga, entity: sargaId } ]
      //   }, false )
      //   console.log( `kandam: ${kandamFileNumber} - ${kandamId}, sarga: ${sargaFileNumber} - ${sargaId}, slokam: ${slokamId}` )
      // }

      console.log( `kandam: ${kandamFileNumber} - ${kandamNamesMap?.text}, sarga: ${sargaText} - ${sargaId}, slokams: ${children.length}` )

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

  // yarn upload-valmiki-ramayan -d '../loaders/data/valmiki_ramayan/'