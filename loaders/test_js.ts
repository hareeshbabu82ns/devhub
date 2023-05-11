import { GraphQLClient, gql } from 'graphql-request';
import { EntityTypeEnum, getSdk } from './src/generated/graphql_js';

const LANG_SANSKRIT = "1";
const LANG_TELUGU = "2";
const LANG_ENGLISH = '3';
const LANG_TAMIL = '4';
const LANG_IAST = '5';
const LANG_SLP = '6';
const LANG_HINDI = '7';

const TYPE_God = '1';
const TYPE_Author = '2';
const TYPE_Slokam = '3';
const TYPE_Adhyaayam = '4';
const TYPE_Parvam = '5';
const TYPE_Kaandam = '6';
const TYPE_Stotram = '7';
const TYPE_Dandakam = '8';
const TYPE_Sarga = '9';
const TYPE_Puranam = '10';
const TYPE_Itihasam = '11';
const TYPE_Others = '12';

async function main() {

  console.log( 'requesting...' )

  const sanscriptClient = new GraphQLClient( 'http://192.168.86.40:24252/graphql' );

  const devhubClient = new GraphQLClient( 'http://localhost:4000/graphql' );
  // const devhubClient = new GraphQLClient('http://devhubjs.kube.local.io/graphql');
  const sdk = getSdk( devhubClient );

  const { data } = await sdk.getEntities( { by: { type: { value: EntityTypeEnum.Slokam } } } )

  console.log( data );
}


main();

