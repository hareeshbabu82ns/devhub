import { GraphQLResolveInfo } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AttributeValueInput = {
  key: Scalars['String'];
  value: Scalars['String'];
};

export type AttributeValueType = {
  __typename?: 'AttributeValueType';
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export enum Dictionary {
  /** 1962	Aufrecht's Catalogus Catalogorum */
  Acc = 'ACC',
  /** 1920	Apte Student`s English-Sanskrit Dictionary */
  Ae = 'AE',
  /** 1957	Practical Sanskrit-English Dictionary */
  Ap = 'AP',
  /** 1890	Apte Practical Sanskrit-English Dictionary */
  Ap90 = 'AP90',
  /** 1861	Abhidhānaratnamālā of Halāyudha */
  Armh = 'ARMH',
  /** 1866	Benfey Sanskrit-English Dictionary */
  Ben = 'BEN',
  /** 1953	Edgerton Buddhist Hybrid Sanskrit Dictionary */
  Bhs = 'BHS',
  /** 1877	Borooah English-Sanskrit Dictionary */
  Bor = 'BOR',
  /** 1891	Cappeller Sanskrit-English Dictionary */
  Cae = 'CAE',
  /** Dhatu Pata */
  DhatuPata = 'DHATU_PATA',
  /** 1856	Goldstücker Sanskrit-English Dictionary */
  Gst = 'GST',
  /** 1966	Indian Epigraphical Glossary */
  Ieg = 'IEG',
  /** 1904	Index to the Names in the Mahabharata */
  Inm = 'INM',
  /** 1965	Kṛdantarūpamālā */
  Krm = 'KRM',
  /** 1884	Lanman`s Sanskrit Reader Vocabulary */
  Lan = 'LAN',
  /** 1993	Mahabharata Cultural Index */
  Mci = 'MCI',
  /** 1893	Macdonell Sanskrit-English Dictionary */
  Md = 'MD',
  /** 1899	Monier-Williams Sanskrit-English Dictionary */
  Mw = 'MW',
  /** 1872	Monier-Williams Sanskrit-English Dictionary */
  Mw72 = 'MW72',
  /** 1851	Monier-Williams English-Sanskrit Dictionary */
  Mwe = 'MWE',
  /** 1976	An Encyclopedic Dictionary */
  Pd = 'PD',
  /** 1975	Puranic Encyclopedia */
  Pe = 'PE',
  /** 1978	Personal and Geographical Names in the Gupta Inscriptions */
  Pgn = 'PGN',
  /** 1951	The Purana Index */
  Pui = 'PUI',
  /** 1900	Shabda-Sagara Sanskrit-English Dictionary */
  Shs = 'SHS',
  /** 1886	Sabda-kalpadruma */
  Skd = 'SKD',
  /** 1974	Meulenbeld's Sanskrit Names of Plants */
  Snp = 'SNP',
  /** 1873	Vacaspatyam */
  Vcp = 'VCP',
  /** 1912	The Vedic Index of Names and Subjects */
  Vei = 'VEI',
  /** 1832	Wilson Sanskrit-English Dictionary */
  Wil = 'WIL',
  /** 1846	Yates Sanskrit-English Dictionary */
  Yat = 'YAT'
}

export type DictionaryItem = {
  __typename?: 'DictionaryItem';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  key: Scalars['String'];
  origin: Dictionary;
};

export type DictionaryKey = {
  __typename?: 'DictionaryKey';
  key: Scalars['String'];
  origin: Dictionary;
};

export type DictionarySearchInput = {
  caseInsensitive?: InputMaybe<Scalars['Boolean']>;
  endsWith?: InputMaybe<Scalars['Boolean']>;
  fuzzySearch?: InputMaybe<Scalars['Boolean']>;
  limit?: InputMaybe<Scalars['Int']>;
  origin?: InputMaybe<Array<Dictionary>>;
  outputScheme?: InputMaybe<SanscriptScheme>;
  search: Scalars['String'];
  searchOnlyKeys?: InputMaybe<Scalars['Boolean']>;
  searchScheme?: InputMaybe<SanscriptScheme>;
  startsWith?: InputMaybe<Scalars['Boolean']>;
};

export type Entity = {
  __typename?: 'Entity';
  attributes?: Maybe<Array<AttributeValueType>>;
  audio?: Maybe<Scalars['String']>;
  bookmarked?: Maybe<Scalars['Boolean']>;
  children?: Maybe<Array<Entity>>;
  childrenCount: Scalars['Int'];
  id: Scalars['ID'];
  imageThumbnail?: Maybe<Scalars['String']>;
  meaning?: Maybe<Scalars['String']>;
  meaningData?: Maybe<Array<LanguageValueType>>;
  notes?: Maybe<Scalars['String']>;
  parents?: Maybe<Array<Entity>>;
  parentsCount: Scalars['Int'];
  text: Scalars['String'];
  textData: Array<LanguageValueType>;
  type: EntityTypeEnum;
};


export type EntityChildrenArgs = {
  type?: InputMaybe<Array<EntityTypeEnum>>;
};


export type EntityChildrenCountArgs = {
  type?: InputMaybe<Array<EntityTypeEnum>>;
};


export type EntityMeaningArgs = {
  language?: InputMaybe<Scalars['String']>;
};


export type EntityParentsArgs = {
  type?: InputMaybe<Array<EntityTypeEnum>>;
};


export type EntityParentsCountArgs = {
  type?: InputMaybe<Array<EntityTypeEnum>>;
};


export type EntityTextArgs = {
  language?: InputMaybe<Scalars['String']>;
};

export type EntityInput = {
  attributes?: InputMaybe<Array<InputMaybe<AttributeValueInput>>>;
  audio?: InputMaybe<Scalars['String']>;
  bookmarked?: InputMaybe<Scalars['Boolean']>;
  /**  Child Entity IDs only (will just link to existing entities)  */
  childIDs?: InputMaybe<Array<TypeEntityInput>>;
  /**  Child Entities with Data (will create new entities)  */
  children?: InputMaybe<Array<EntityInput>>;
  imageThumbnail?: InputMaybe<Scalars['String']>;
  meaning?: InputMaybe<Array<InputMaybe<LanguageValueInput>>>;
  notes?: InputMaybe<Scalars['String']>;
  /**  Parent Entity IDs only (will just link to existing entities)  */
  parentIDs?: InputMaybe<Array<TypeEntityInput>>;
  /**  Parent Entities with Data (will create new entities)  */
  parents?: InputMaybe<Array<EntityInput>>;
  text?: InputMaybe<Array<InputMaybe<LanguageValueInput>>>;
  type?: InputMaybe<EntityTypeEnum>;
};

export type EntitySearchInput = {
  and?: InputMaybe<Array<EntitySearchInput>>;
  bookmarked?: InputMaybe<FilterBoolean>;
  id?: InputMaybe<FilterId>;
  or?: InputMaybe<Array<EntitySearchInput>>;
  text?: InputMaybe<FilterString>;
  type?: InputMaybe<FilterEntityTypeEnum>;
};

export type EntityType = {
  __typename?: 'EntityType';
  code: EntityTypeEnum;
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: Scalars['String'];
  nameData: Array<LanguageValueType>;
};


export type EntityTypeNameArgs = {
  language?: InputMaybe<Scalars['String']>;
};

export enum EntityTypeEnum {
  Adhyaayam = 'ADHYAAYAM',
  Author = 'AUTHOR',
  Dandakam = 'DANDAKAM',
  Ghattam = 'GHATTAM',
  God = 'GOD',
  Itihasam = 'ITIHASAM',
  Kaandam = 'KAANDAM',
  Others = 'OTHERS',
  Parvam = 'PARVAM',
  Puranam = 'PURANAM',
  Sarga = 'SARGA',
  Skandam = 'SKANDAM',
  Slokam = 'SLOKAM',
  Sthotram = 'STHOTRAM'
}

export type EntityTypeInput = {
  code?: InputMaybe<EntityTypeEnum>;
  description?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Array<InputMaybe<LanguageValueInput>>>;
};

export type EntityTypeSearchInput = {
  and?: InputMaybe<Array<EntityTypeSearchInput>>;
  code?: InputMaybe<FilterEntityTypeEnum>;
  description?: InputMaybe<FilterString>;
  id?: InputMaybe<FilterId>;
  name?: InputMaybe<FilterString>;
  or?: InputMaybe<Array<EntityTypeSearchInput>>;
};

export type FilterBoolean = {
  operation?: InputMaybe<FilterOperation>;
  path?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Boolean']>;
  valueList?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type FilterEntityTypeEnum = {
  operation?: InputMaybe<FilterOperation>;
  path?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<EntityTypeEnum>;
  valueList?: InputMaybe<Array<EntityTypeEnum>>;
  valueString?: InputMaybe<Scalars['String']>;
};

export type FilterFloat = {
  operation?: InputMaybe<FilterOperation>;
  path?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Float']>;
  valueList?: InputMaybe<Array<Scalars['Float']>>;
};

export type FilterId = {
  operation?: InputMaybe<FilterOperation>;
  path?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['ID']>;
  valueList?: InputMaybe<Array<Scalars['ID']>>;
};

export type FilterInt = {
  operation?: InputMaybe<FilterOperation>;
  path?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['Int']>;
  valueList?: InputMaybe<Array<Scalars['Int']>>;
};

export enum FilterOperation {
  All = 'ALL',
  Equals = 'EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanEquals = 'GREATER_THAN_EQUALS',
  In = 'IN',
  LessThan = 'LESS_THAN',
  LessThanEquals = 'LESS_THAN_EQUALS',
  NotEquals = 'NOT_EQUALS',
  NotIn = 'NOT_IN',
  Regex = 'REGEX'
}

export type FilterString = {
  operation?: InputMaybe<FilterOperation>;
  path?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
  valueList?: InputMaybe<Array<Scalars['String']>>;
};

export type Language = {
  __typename?: 'Language';
  description?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  iso: Scalars['String'];
  name: Scalars['String'];
};

export type LanguageInput = {
  description?: InputMaybe<Scalars['String']>;
  iso?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type LanguageSearchInput = {
  and?: InputMaybe<Array<LanguageSearchInput>>;
  description?: InputMaybe<FilterString>;
  id?: InputMaybe<FilterId>;
  iso?: InputMaybe<FilterString>;
  name?: InputMaybe<FilterString>;
  or?: InputMaybe<Array<LanguageSearchInput>>;
};

export type LanguageValueInput = {
  language: Scalars['String'];
  value: Scalars['String'];
};

export type LanguageValueType = {
  __typename?: 'LanguageValueType';
  language?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEntity: Scalars['ID'];
  createEntityType: Scalars['ID'];
  createLanguage: Scalars['ID'];
  createUser: Scalars['ID'];
  deleteEntity: Scalars['ID'];
  deleteEntityType: Scalars['ID'];
  deleteLanguage: Scalars['ID'];
  deleteUser: Scalars['ID'];
  init: Scalars['String'];
  updateEntity: Scalars['ID'];
  updateEntityType: Scalars['ID'];
  updateLanguage: Scalars['ID'];
  updateUser: Scalars['ID'];
  version: Scalars['String'];
};


export type MutationCreateEntityArgs = {
  withData?: InputMaybe<EntityInput>;
};


export type MutationCreateEntityTypeArgs = {
  withData?: InputMaybe<EntityTypeInput>;
};


export type MutationCreateLanguageArgs = {
  withData?: InputMaybe<LanguageInput>;
};


export type MutationCreateUserArgs = {
  withData?: InputMaybe<UserInput>;
};


export type MutationDeleteEntityArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEntityTypeArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteLanguageArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateEntityArgs = {
  id: Scalars['ID'];
  withData?: InputMaybe<EntityInput>;
};


export type MutationUpdateEntityTypeArgs = {
  id: Scalars['ID'];
  withData?: InputMaybe<EntityTypeInput>;
};


export type MutationUpdateLanguageArgs = {
  id: Scalars['ID'];
  withData?: InputMaybe<LanguageInput>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  withData?: InputMaybe<UserInput>;
};

export type Parse = {
  __typename?: 'Parse';
  analysis: Array<Maybe<ParseItem>>;
  parseDotURLs: Array<Scalars['String']>;
  parseDots: Array<Scalars['String']>;
  splitDot: Scalars['String'];
  splitDotURL: Scalars['String'];
};

export type ParseGraph = {
  __typename?: 'ParseGraph';
  node?: Maybe<ParseTag>;
  predecessor?: Maybe<ParseTag>;
  sambandha?: Maybe<Scalars['String']>;
};

export type ParseItem = {
  __typename?: 'ParseItem';
  graph: Array<ParseGraph>;
};

export type ParseTag = {
  __typename?: 'ParseTag';
  pada: Scalars['String'];
  root?: Maybe<Scalars['String']>;
  tags: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  dictionarySearch?: Maybe<Array<DictionaryItem>>;
  dictionarySearchById: DictionaryItem;
  entities: Array<Entity>;
  entityTypes: Array<EntityType>;
  joins: Array<Scalars['String']>;
  languages: Array<Language>;
  me: User;
  parse: Array<Parse>;
  presegmented: Array<Scalars['String']>;
  splits: Array<Array<Scalars['String']>>;
  tags: Array<Tag>;
  transliterate: Scalars['String'];
  users: Array<User>;
  version: Scalars['String'];
};


export type QueryDictionarySearchArgs = {
  searchWith: DictionarySearchInput;
};


export type QueryDictionarySearchByIdArgs = {
  id: Scalars['ID'];
  outputScheme?: InputMaybe<SanscriptScheme>;
};


export type QueryEntitiesArgs = {
  by?: InputMaybe<EntitySearchInput>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryEntityTypesArgs = {
  by?: InputMaybe<EntityTypeSearchInput>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryJoinsArgs = {
  schemeFrom?: InputMaybe<SanscriptScheme>;
  schemeTo?: InputMaybe<SanscriptScheme>;
  strictIO?: InputMaybe<Scalars['Boolean']>;
  words: Array<Scalars['String']>;
};


export type QueryLanguagesArgs = {
  by?: InputMaybe<LanguageSearchInput>;
  limit?: InputMaybe<Scalars['Int']>;
};


export type QueryParseArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  preSegmented?: InputMaybe<Scalars['Boolean']>;
  schemeFrom?: InputMaybe<SanscriptScheme>;
  schemeTo?: InputMaybe<SanscriptScheme>;
  strictIO?: InputMaybe<Scalars['Boolean']>;
  text: Scalars['String'];
};


export type QueryPresegmentedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  schemeFrom?: InputMaybe<SanscriptScheme>;
  schemeTo?: InputMaybe<SanscriptScheme>;
  strictIO?: InputMaybe<Scalars['Boolean']>;
  text: Scalars['String'];
};


export type QuerySplitsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  schemeFrom?: InputMaybe<SanscriptScheme>;
  schemeTo?: InputMaybe<SanscriptScheme>;
  strictIO?: InputMaybe<Scalars['Boolean']>;
  text: Scalars['String'];
};


export type QueryTagsArgs = {
  schemeFrom?: InputMaybe<SanscriptScheme>;
  schemeTo?: InputMaybe<SanscriptScheme>;
  strictIO?: InputMaybe<Scalars['Boolean']>;
  text: Scalars['String'];
};


export type QueryTransliterateArgs = {
  schemeFrom?: InputMaybe<SanscriptScheme>;
  schemeTo?: InputMaybe<SanscriptScheme>;
  text: Scalars['String'];
};


export type QueryUsersArgs = {
  by?: InputMaybe<UserSearchInput>;
  limit?: InputMaybe<Scalars['Int']>;
};

export enum SanscriptScheme {
  Devanagari = 'DEVANAGARI',
  Iast = 'IAST',
  Itrans = 'ITRANS',
  Kannada = 'KANNADA',
  Slp1 = 'SLP1',
  Tamil = 'TAMIL',
  Telugu = 'TELUGU'
}

export type Tag = {
  __typename?: 'Tag';
  tags: Array<Scalars['String']>;
  word: Scalars['String'];
};

export type TypeEntityInput = {
  entity: Scalars['ID'];
  type: EntityTypeEnum;
};

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  settings?: Maybe<Scalars['String']>;
};

export type UserInput = {
  displayName?: InputMaybe<Scalars['String']>;
  settings?: InputMaybe<Scalars['String']>;
};

export type UserSearchInput = {
  and?: InputMaybe<Array<UserSearchInput>>;
  displayName?: InputMaybe<FilterString>;
  id?: InputMaybe<FilterId>;
  or?: InputMaybe<Array<UserSearchInput>>;
  settings?: InputMaybe<FilterString>;
};

export type GetVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVersionQuery = { __typename?: 'Query', version: string };

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLanguagesQuery = { __typename?: 'Query', languages: Array<{ __typename?: 'Language', id: string, iso: string, name: string, description?: string | null }> };

export type GetEntityTypesQueryVariables = Exact<{
  language?: InputMaybe<Scalars['String']>;
}>;


export type GetEntityTypesQuery = { __typename?: 'Query', entityTypes: Array<{ __typename?: 'EntityType', id: string, name: string, code: EntityTypeEnum, description?: string | null }> };

export type TransliterateQueryVariables = Exact<{
  text: Scalars['String'];
  languageFrom?: InputMaybe<SanscriptScheme>;
  languageTo?: InputMaybe<SanscriptScheme>;
}>;


export type TransliterateQuery = { __typename?: 'Query', transliterate: string };

export type GetEntitiesQueryVariables = Exact<{
  by: EntitySearchInput;
}>;


export type GetEntitiesQuery = { __typename?: 'Query', entities: Array<{ __typename?: 'Entity', id: string, text: string, type: EntityTypeEnum, children?: Array<{ __typename?: 'Entity', id: string, type: EntityTypeEnum, text: string }> | null, parents?: Array<{ __typename?: 'Entity', id: string, type: EntityTypeEnum, text: string }> | null }> };

export type CreateEntityMutationVariables = Exact<{
  withData?: InputMaybe<EntityInput>;
}>;


export type CreateEntityMutation = { __typename?: 'Mutation', createEntity: string };


export const GetVersionDocument = gql`
    query getVersion {
  version
}
    `;
export const GetLanguagesDocument = gql`
    query getLanguages {
  languages {
    id
    iso
    name
    description
  }
}
    `;
export const GetEntityTypesDocument = gql`
    query getEntityTypes($language: String) {
  entityTypes {
    id
    name(language: $language)
    code
    description
  }
}
    `;
export const TransliterateDocument = gql`
    query transliterate($text: String!, $languageFrom: SanscriptScheme, $languageTo: SanscriptScheme) {
  transliterate(text: $text, schemeFrom: $languageFrom, schemeTo: $languageTo)
}
    `;
export const GetEntitiesDocument = gql`
    query getEntities($by: EntitySearchInput!) {
  entities(by: $by) {
    id
    text
    type
    children {
      id
      type
      text
    }
    parents {
      id
      type
      text
    }
  }
}
    `;
export const CreateEntityDocument = gql`
    mutation createEntity($withData: EntityInput) {
  createEntity(withData: $withData)
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetVersionDocumentString = print(GetVersionDocument);
const GetLanguagesDocumentString = print(GetLanguagesDocument);
const GetEntityTypesDocumentString = print(GetEntityTypesDocument);
const TransliterateDocumentString = print(TransliterateDocument);
const GetEntitiesDocumentString = print(GetEntitiesDocument);
const CreateEntityDocumentString = print(CreateEntityDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getVersion(variables?: GetVersionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetVersionQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetVersionQuery>(GetVersionDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getVersion', 'query');
    },
    getLanguages(variables?: GetLanguagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetLanguagesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetLanguagesQuery>(GetLanguagesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLanguages', 'query');
    },
    getEntityTypes(variables?: GetEntityTypesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetEntityTypesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntityTypesQuery>(GetEntityTypesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntityTypes', 'query');
    },
    transliterate(variables: TransliterateQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: TransliterateQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<TransliterateQuery>(TransliterateDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'transliterate', 'query');
    },
    getEntities(variables: GetEntitiesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetEntitiesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities', 'query');
    },
    createEntity(variables?: CreateEntityMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: CreateEntityMutation; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<CreateEntityMutation>(CreateEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createEntity', 'mutation');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;


export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AttributeValueInput: AttributeValueInput;
  AttributeValueType: ResolverTypeWrapper<AttributeValueType>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Dictionary: Dictionary;
  DictionaryItem: ResolverTypeWrapper<DictionaryItem>;
  DictionaryKey: ResolverTypeWrapper<DictionaryKey>;
  DictionarySearchInput: DictionarySearchInput;
  Entity: ResolverTypeWrapper<Entity>;
  EntityInput: EntityInput;
  EntitySearchInput: EntitySearchInput;
  EntityType: ResolverTypeWrapper<EntityType>;
  EntityTypeEnum: EntityTypeEnum;
  EntityTypeInput: EntityTypeInput;
  EntityTypeSearchInput: EntityTypeSearchInput;
  FilterBoolean: FilterBoolean;
  FilterEntityTypeEnum: FilterEntityTypeEnum;
  FilterFloat: FilterFloat;
  FilterID: FilterId;
  FilterInt: FilterInt;
  FilterOperation: FilterOperation;
  FilterString: FilterString;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Language: ResolverTypeWrapper<Language>;
  LanguageInput: LanguageInput;
  LanguageSearchInput: LanguageSearchInput;
  LanguageValueInput: LanguageValueInput;
  LanguageValueType: ResolverTypeWrapper<LanguageValueType>;
  Mutation: ResolverTypeWrapper<{}>;
  Parse: ResolverTypeWrapper<Parse>;
  ParseGraph: ResolverTypeWrapper<ParseGraph>;
  ParseItem: ResolverTypeWrapper<ParseItem>;
  ParseTag: ResolverTypeWrapper<ParseTag>;
  Query: ResolverTypeWrapper<{}>;
  SanscriptScheme: SanscriptScheme;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<Tag>;
  TypeEntityInput: TypeEntityInput;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserSearchInput: UserSearchInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AttributeValueInput: AttributeValueInput;
  AttributeValueType: AttributeValueType;
  Boolean: Scalars['Boolean'];
  DictionaryItem: DictionaryItem;
  DictionaryKey: DictionaryKey;
  DictionarySearchInput: DictionarySearchInput;
  Entity: Entity;
  EntityInput: EntityInput;
  EntitySearchInput: EntitySearchInput;
  EntityType: EntityType;
  EntityTypeInput: EntityTypeInput;
  EntityTypeSearchInput: EntityTypeSearchInput;
  FilterBoolean: FilterBoolean;
  FilterEntityTypeEnum: FilterEntityTypeEnum;
  FilterFloat: FilterFloat;
  FilterID: FilterId;
  FilterInt: FilterInt;
  FilterString: FilterString;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Language: Language;
  LanguageInput: LanguageInput;
  LanguageSearchInput: LanguageSearchInput;
  LanguageValueInput: LanguageValueInput;
  LanguageValueType: LanguageValueType;
  Mutation: {};
  Parse: Parse;
  ParseGraph: ParseGraph;
  ParseItem: ParseItem;
  ParseTag: ParseTag;
  Query: {};
  String: Scalars['String'];
  Tag: Tag;
  TypeEntityInput: TypeEntityInput;
  User: User;
  UserInput: UserInput;
  UserSearchInput: UserSearchInput;
};

export type AttributeValueTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AttributeValueType'] = ResolversParentTypes['AttributeValueType']> = {
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DictionaryItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['DictionaryItem'] = ResolversParentTypes['DictionaryItem']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  origin?: Resolver<ResolversTypes['Dictionary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DictionaryKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['DictionaryKey'] = ResolversParentTypes['DictionaryKey']> = {
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  origin?: Resolver<ResolversTypes['Dictionary'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  attributes?: Resolver<Maybe<Array<ResolversTypes['AttributeValueType']>>, ParentType, ContextType>;
  audio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  bookmarked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  children?: Resolver<Maybe<Array<ResolversTypes['Entity']>>, ParentType, ContextType, Partial<EntityChildrenArgs>>;
  childrenCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<EntityChildrenCountArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageThumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  meaning?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<EntityMeaningArgs, 'language'>>;
  meaningData?: Resolver<Maybe<Array<ResolversTypes['LanguageValueType']>>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  parents?: Resolver<Maybe<Array<ResolversTypes['Entity']>>, ParentType, ContextType, Partial<EntityParentsArgs>>;
  parentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<EntityParentsCountArgs>>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<EntityTextArgs, 'language'>>;
  textData?: Resolver<Array<ResolversTypes['LanguageValueType']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['EntityTypeEnum'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityType'] = ResolversParentTypes['EntityType']> = {
  code?: Resolver<ResolversTypes['EntityTypeEnum'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<EntityTypeNameArgs, 'language'>>;
  nameData?: Resolver<Array<ResolversTypes['LanguageValueType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  iso?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageValueTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['LanguageValueType'] = ResolversParentTypes['LanguageValueType']> = {
  language?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  value?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createEntity?: Resolver<ResolversTypes['ID'], ParentType, ContextType, Partial<MutationCreateEntityArgs>>;
  createEntityType?: Resolver<ResolversTypes['ID'], ParentType, ContextType, Partial<MutationCreateEntityTypeArgs>>;
  createLanguage?: Resolver<ResolversTypes['ID'], ParentType, ContextType, Partial<MutationCreateLanguageArgs>>;
  createUser?: Resolver<ResolversTypes['ID'], ParentType, ContextType, Partial<MutationCreateUserArgs>>;
  deleteEntity?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteEntityArgs, 'id'>>;
  deleteEntityType?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteEntityTypeArgs, 'id'>>;
  deleteLanguage?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteLanguageArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'id'>>;
  init?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updateEntity?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationUpdateEntityArgs, 'id'>>;
  updateEntityType?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationUpdateEntityTypeArgs, 'id'>>;
  updateLanguage?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationUpdateLanguageArgs, 'id'>>;
  updateUser?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'id'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type ParseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Parse'] = ResolversParentTypes['Parse']> = {
  analysis?: Resolver<Array<Maybe<ResolversTypes['ParseItem']>>, ParentType, ContextType>;
  parseDotURLs?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  parseDots?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  splitDot?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  splitDotURL?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParseGraphResolvers<ContextType = any, ParentType extends ResolversParentTypes['ParseGraph'] = ResolversParentTypes['ParseGraph']> = {
  node?: Resolver<Maybe<ResolversTypes['ParseTag']>, ParentType, ContextType>;
  predecessor?: Resolver<Maybe<ResolversTypes['ParseTag']>, ParentType, ContextType>;
  sambandha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParseItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['ParseItem'] = ResolversParentTypes['ParseItem']> = {
  graph?: Resolver<Array<ResolversTypes['ParseGraph']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ParseTagResolvers<ContextType = any, ParentType extends ResolversParentTypes['ParseTag'] = ResolversParentTypes['ParseTag']> = {
  pada?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  root?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  dictionarySearch?: Resolver<Maybe<Array<ResolversTypes['DictionaryItem']>>, ParentType, ContextType, RequireFields<QueryDictionarySearchArgs, 'searchWith'>>;
  dictionarySearchById?: Resolver<ResolversTypes['DictionaryItem'], ParentType, ContextType, RequireFields<QueryDictionarySearchByIdArgs, 'id'>>;
  entities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType, RequireFields<QueryEntitiesArgs, 'limit'>>;
  entityTypes?: Resolver<Array<ResolversTypes['EntityType']>, ParentType, ContextType, RequireFields<QueryEntityTypesArgs, 'limit'>>;
  joins?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryJoinsArgs, 'words'>>;
  languages?: Resolver<Array<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<QueryLanguagesArgs, 'limit'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  parse?: Resolver<Array<ResolversTypes['Parse']>, ParentType, ContextType, RequireFields<QueryParseArgs, 'text'>>;
  presegmented?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryPresegmentedArgs, 'text'>>;
  splits?: Resolver<Array<Array<ResolversTypes['String']>>, ParentType, ContextType, RequireFields<QuerySplitsArgs, 'text'>>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryTagsArgs, 'text'>>;
  transliterate?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryTransliterateArgs, 'text'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'limit'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  word?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AttributeValueType?: AttributeValueTypeResolvers<ContextType>;
  DictionaryItem?: DictionaryItemResolvers<ContextType>;
  DictionaryKey?: DictionaryKeyResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  EntityType?: EntityTypeResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  LanguageValueType?: LanguageValueTypeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Parse?: ParseResolvers<ContextType>;
  ParseGraph?: ParseGraphResolvers<ContextType>;
  ParseItem?: ParseItemResolvers<ContextType>;
  ParseTag?: ParseTagResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

