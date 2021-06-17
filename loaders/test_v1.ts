import { GraphQLClient, gql } from 'graphql-request';
import { getSdk } from './src/generated/graphql_v1';

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

const sanscriptClient = new GraphQLClient('http://192.168.86.40:24252/graphql');

const devhubClient = new GraphQLClient('https://devhub.terabits.io/graphql/');
const sdk = getSdk(devhubClient);

async function main() {

  console.log('requesting...')

  // const { data: languages } = await sdk.getLanguages();
  // console.log('languages: ', languages);
  // const { data: entityTypes } = await sdk.getEntityTypes();
  // console.log('entityTypes: ', entityTypes);

  const { data } = await sdk.getEntitiesList({ type: TYPE_God, language: LANG_TELUGU });
  data?.entities?.forEach((entity) => console.log(entity));

  // await transliterateSarga('13444', LANG_SANSKRIT, 'SLP1')

}

async function transliterateSarga(sargaId: string, fromLang: string, toLang: string) {
  // get sarga contents
  const { data } = await sdk.getEntityContents({ entityId: sargaId, language: fromLang, meaningLanguage: LANG_TELUGU });
  const sarga = data?.entities![0];
  sarga?.childEntities?.forEach(async (sloka) => {
    // console.log(sloka);

    // transliterate to target language
    const { transliterate } = await sanscriptClient.request(TRANSLITERATE,
      { 'text': sloka?.content![0]?.content, 'languageTo': toLang });
    console.log(transliterate)

    // update sloka content
    const { data: updatedContent } = await sdk.updateContent({
      withData:
        { parentEntity: sloka.id, content: transliterate, language: LANG_TELUGU }
    });
    console.log('content updated:', updatedContent)

  });
}
const TRANSLITERATE = gql`
query trans($text:String!,$languageTo:SanscriptScheme!){
  transliterate(text: $text, schemeTo: $languageTo)
}
`;

main();

