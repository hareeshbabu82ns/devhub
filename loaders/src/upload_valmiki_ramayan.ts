import { GraphQLClient, gql } from 'graphql-request';
import { DEVHUB_API_URL } from './constants';
import { EntityInput, EntityTypeEnum, getSdk, LanguageValueInput, SanscriptScheme } from './generated/graphql_js';

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

    for ( let sargaFileNumber = 1; sargaFileNumber < 200; sargaFileNumber++ ) {

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

      // create slokams child data
      const arthKeys: String[] = [];
      const childrenArthMap = inputData.contents
        .filter( ( c: any ) => c?.slokam?.length > 0 )
        .map( ( c: any ) => {
          const arthamSplits = c?.prati_pada_artham?.replaceAll( `\n`, '' )
            .split( ';' ).map( ( e: String ) => e.trim() )
            .filter( ( e: String ) => e.length > 0 ) || []
          const splits = arthamSplits
            .map( ( e: String ) => {
              const key = e.split( '=' )[ 0 ]?.trim() || ''
              arthKeys.push( key );
              return {
                key,
                meaning: e.split( '=' )[ 1 ]?.trim() || '',
              }
            } )
          // .filter( ( e: { key: String, meaning: String } ) => e.key.length > 0 )
          arthKeys.push( `\n` );
          return splits;
        } )

      console.log( `sarga ${sargaFileNumber}:` );
      // console.dir( childrenArthMap )
      const arthStr = arthKeys.join( ';' );
      // console.dir( arthStr )
      const stel = await sdk.transliterate( {
        text: arthStr,
        languageFrom: SanscriptScheme.Itrans,
        languageTo: SanscriptScheme.Telugu
      } );
      const arthamKeysTel = stel?.data?.transliterate.split( '\n' )
        .map( ( e: String ) => e.split( ';' ).filter( e => e.length > 0 ) );


      const children: EntityInput[] = inputData.contents
        .filter( ( c: any ) => c?.slokam?.length > 0 )
        .map( ( c: any, i: any ) => {
          const arthKeys = arthamKeysTel[ i ]
          const arthMeanings = childrenArthMap[ i ]
          // console.dir( arthKeys )
          // console.dir( arthMeanings )
          const prati_pada_artham = arthMeanings.map( ( e: { key: String, meaning: String }, i: any ) => {
            // console.log( i, e, arthKeys[ i ] );
            return `${arthKeys[ i ]} ( ${e.key} ) = ${e.meaning}`
          } ).join( `  \n` )
          // console.log( prati_pada_artham );
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
              { key: 'each_word_meaning', value: prati_pada_artham }
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