import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { GraphQLError } from 'graphql-request/dist/types';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  DateTime: string;
};

export type Bookmark = {
  __typename?: 'Bookmark';
  id?: Maybe<Scalars['ID']>;
  user: Scalars['String'];
  entity?: Maybe<Entity>;
  url?: Maybe<Scalars['String']>;
};

export type BookmarkByInput = {
  id?: Maybe<Scalars['ID']>;
  entity?: Maybe<Scalars['ID']>;
  url?: Maybe<Scalars['String']>;
};

export type BookmarkInput = {
  entity: Scalars['ID'];
  url?: Maybe<Scalars['String']>;
};

export type BookmarkUpdateInput = {
  entity?: Maybe<Scalars['ID']>;
  url?: Maybe<Scalars['String']>;
};

/** Content related extra data */
export type ContentExtras = {
  __typename?: 'ContentExtras';
  id: Scalars['ID'];
  parent: Entity;
  language: Language;
  content: Scalars['String'];
};

export type ContentExtrasInput = {
  language: Scalars['ID'];
  content: Scalars['String'];
};

/** Acutual content of the Entity */
export type ContentLine = {
  __typename?: 'ContentLine';
  id: Scalars['ID'];
  parentEntity: Entity;
  language: Language;
  content: Scalars['String'];
  meaning?: Maybe<ContentMeaning>;
  extras?: Maybe<ContentExtras>;
};


/** Acutual content of the Entity */
export type ContentLineMeaningArgs = {
  language: Scalars['ID'];
};

export type ContentLineInput = {
  parentEntity?: Maybe<Scalars['ID']>;
  language: Scalars['ID'];
  content: Scalars['String'];
};

export type ContentLinesBy = {
  id?: Maybe<Scalars['ID']>;
  parent?: Maybe<Scalars['ID']>;
  language?: Maybe<Scalars['ID']>;
};

/** Content related meaning */
export type ContentMeaning = {
  __typename?: 'ContentMeaning';
  id: Scalars['ID'];
  parent: Entity;
  language: Language;
  content: Scalars['String'];
};

export type ContentMeaningInput = {
  parentEntity?: Maybe<Scalars['ID']>;
  language: Scalars['ID'];
  content: Scalars['String'];
};

export type ContentMeaningsBy = {
  id?: Maybe<Scalars['ID']>;
  parent?: Maybe<Scalars['ID']>;
  language?: Maybe<Scalars['ID']>;
};



/** Sanskript Dictionary Sources */
export enum Dictionaries {
  /** Vacaspatyam */
  Vcp = 'VCP',
  /** Dhatu Pata */
  DhatuPata = 'DHATU_PATA',
  /** Monier-Williams */
  Mw = 'MW',
  /** Monier-Williams English */
  Mwe = 'MWE',
  /** Sabda-kalpadruma */
  Skd = 'SKD'
}

/** Dictionary Tools */
export type DictionaryItem = {
  __typename?: 'DictionaryItem';
  id: Scalars['ID'];
  key: Scalars['String'];
  fromDictionary: Dictionaries;
  content: Scalars['String'];
};

export type DictionaryKey = {
  __typename?: 'DictionaryKey';
  id: Scalars['ID'];
  devanagari?: Maybe<Scalars['String']>;
};

export type DictionarySearchInput = {
  search: Scalars['String'];
  /** Search String scheme (default: SLP1) */
  searchScheme?: Maybe<SanscriptScheme>;
  /** full text search on key and description */
  fuzzySearch?: Maybe<Scalars['Boolean']>;
  /**
   * Searches only in Keys, skips checking in descriptions \
   * `ignored when fuzzySearch is selected`
   */
  searchOnlyKeys?: Maybe<Scalars['Boolean']>;
  caseInsensitive?: Maybe<Scalars['Boolean']>;
  /**
   * searches where the input is at starting position \
   * `ignored when fuzzySearch is selected`
   */
  startsWith?: Maybe<Scalars['Boolean']>;
  /**
   * searches where the input is at ending position \
   * `ignored when fuzzySearch is selected`
   */
  endsWith?: Maybe<Scalars['Boolean']>;
  origin?: Maybe<Dictionaries>;
  /** scheme for output (default: DEVANAGARI) */
  outputScheme?: Maybe<SanscriptScheme>;
  limit?: Maybe<Scalars['Int']>;
};

export type EntitiesBy = {
  id?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['ID']>;
  text?: Maybe<Scalars['String']>;
  textLike?: Maybe<Scalars['String']>;
};

/** Base Entity of the system ex Slokam, Adhyaayam, Grandham etc. */
export type Entity = {
  __typename?: 'Entity';
  id: Scalars['ID'];
  type: EntityType;
  order?: Maybe<Scalars['Int']>;
  /** fallback default Text for Entity if TextData is missing */
  defaultText: Scalars['String'];
  defaultThumbnail: Scalars['String'];
  /** ',' delimited tags for identification     */
  tags?: Maybe<Scalars['String']>;
  childEntities?: Maybe<Array<Entity>>;
  parentEntities?: Maybe<Array<Entity>>;
  textData?: Maybe<Array<EntityText>>;
  metaData?: Maybe<Array<EntityMeta>>;
  content?: Maybe<Array<ContentLine>>;
  contentMeaning?: Maybe<Array<ContentMeaning>>;
  childTypes?: Maybe<Array<EntityType>>;
};


/** Base Entity of the system ex Slokam, Adhyaayam, Grandham etc. */
export type EntityChildEntitiesArgs = {
  by?: Maybe<RelatedEntitiesBy>;
};


/** Base Entity of the system ex Slokam, Adhyaayam, Grandham etc. */
export type EntityParentEntitiesArgs = {
  by?: Maybe<RelatedEntitiesBy>;
};


/** Base Entity of the system ex Slokam, Adhyaayam, Grandham etc. */
export type EntityTextDataArgs = {
  language?: Maybe<Scalars['ID']>;
};


/** Base Entity of the system ex Slokam, Adhyaayam, Grandham etc. */
export type EntityContentArgs = {
  language: Scalars['ID'];
};


/** Base Entity of the system ex Slokam, Adhyaayam, Grandham etc. */
export type EntityContentMeaningArgs = {
  language: Scalars['ID'];
};

export type EntityContentInput = {
  parentId?: Maybe<Scalars['ID']>;
  defaultText?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['ID']>;
  order?: Maybe<Scalars['Int']>;
  tags?: Maybe<Scalars['String']>;
  textData?: Maybe<Array<EntityTextDataInput>>;
  metaData?: Maybe<Array<EntityMetaDataInput>>;
  content?: Maybe<Array<ContentLineInput>>;
  meaning?: Maybe<Array<ContentMeaningInput>>;
  extras?: Maybe<Array<ContentExtrasInput>>;
};

/** Meta Data for the Entity (leaf node of the Graph, sibling to TextData) */
export type EntityMeta = {
  __typename?: 'EntityMeta';
  id: Scalars['ID'];
  parentEntity: Entity;
  /** parent Entity Type */
  type: EntityType;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type EntityMetaDataInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

/** Entity to Entity Relationship */
export type EntityRelation = {
  __typename?: 'EntityRelation';
  id: Scalars['ID'];
  fromEntity: Entity;
  fromType: EntityType;
  toEntity: Entity;
  toType: EntityType;
};

/** Text data for the Entity (leaf node of the Graph) */
export type EntityText = {
  __typename?: 'EntityText';
  id: Scalars['ID'];
  parentEntity: Entity;
  /** parent Entity Type */
  type: EntityType;
  language: Language;
  text: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type EntityTextDataInput = {
  id?: Maybe<Scalars['ID']>;
  language: Scalars['ID'];
  text: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

/** Type of the Entity ex. God, Author, Slokam etc. */
export type EntityType = {
  __typename?: 'EntityType';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

/** ISO Language identifier ex. SAN, TEL, ENG etc. */
export type Language = {
  __typename?: 'Language';
  id: Scalars['ID'];
  iso: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  updateBookmark: Bookmark;
  deleteBookmark?: Maybe<Scalars['Boolean']>;
  deleteEntity?: Maybe<Scalars['Boolean']>;
  updateEntityContent: Entity;
  updateContent: ContentLine;
  deleteContent?: Maybe<Scalars['Boolean']>;
  updateContentMeaning: ContentMeaning;
  deleteContentMeaning?: Maybe<Scalars['Boolean']>;
  updateSettings: Settings;
};


export type MutationUpdateBookmarkArgs = {
  id?: Maybe<Scalars['ID']>;
  withData: BookmarkUpdateInput;
};


export type MutationDeleteBookmarkArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteEntityArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateEntityContentArgs = {
  id?: Maybe<Scalars['ID']>;
  withData: EntityContentInput;
};


export type MutationUpdateContentArgs = {
  id?: Maybe<Scalars['ID']>;
  withData?: Maybe<ContentLineInput>;
};


export type MutationDeleteContentArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateContentMeaningArgs = {
  id?: Maybe<Scalars['ID']>;
  withData?: Maybe<ContentMeaningInput>;
};


export type MutationDeleteContentMeaningArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateSettingsArgs = {
  user: Scalars['ID'];
  content: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  me: User;
  entityTypes: Array<EntityType>;
  languages: Array<Language>;
  entities?: Maybe<Array<Entity>>;
  contentLines?: Maybe<Array<ContentLine>>;
  contentMeanings?: Maybe<Array<ContentMeaning>>;
  bookmarks?: Maybe<Array<Bookmark>>;
  dictionarySearch?: Maybe<Array<DictionaryItem>>;
  dictionaryKeySearch: Array<DictionaryKey>;
  dictionaryMeanings: Array<DictionaryItem>;
  sanskritSplits?: Maybe<Array<Maybe<Array<Scalars['String']>>>>;
  sanskritSandhi?: Maybe<Array<Scalars['String']>>;
};


export type QueryEntitiesArgs = {
  by: EntitiesBy;
};


export type QueryContentLinesArgs = {
  by: ContentLinesBy;
};


export type QueryContentMeaningsArgs = {
  by: ContentMeaningsBy;
};


export type QueryBookmarksArgs = {
  by?: Maybe<BookmarkByInput>;
};


export type QueryDictionarySearchArgs = {
  searchWith: DictionarySearchInput;
};


export type QueryDictionaryKeySearchArgs = {
  key: Scalars['String'];
  inDictionary?: Maybe<Dictionaries>;
  maxHits?: Maybe<Scalars['Int']>;
  asDevanagari?: Maybe<Scalars['Boolean']>;
  searchContent?: Maybe<Scalars['Boolean']>;
  fuzzySearch?: Maybe<Scalars['Boolean']>;
};


export type QueryDictionaryMeaningsArgs = {
  keys?: Array<Scalars['String']>;
  inDictionary?: Maybe<Dictionaries>;
  asDevanagari?: Maybe<Scalars['Boolean']>;
  maxHits?: Maybe<Scalars['Int']>;
};


export type QuerySanskritSplitsArgs = {
  content: Scalars['String'];
  maxPaths?: Maybe<Scalars['Int']>;
  asDevanagari?: Maybe<Scalars['Boolean']>;
};


export type QuerySanskritSandhiArgs = {
  splits?: Array<Scalars['String']>;
  asDevanagari?: Maybe<Scalars['Boolean']>;
};

export type RelatedEntitiesBy = {
  type?: Maybe<Scalars['ID']>;
  hasContentInLanguage?: Maybe<Scalars['ID']>;
};

/** Sanskript Transliterate Schemes */
export enum SanscriptScheme {
  /** Devanagari (Samskrutam) */
  Devanagari = 'DEVANAGARI',
  /** International Alphabet of Sanskrit Transliteration */
  Iast = 'IAST',
  /** Indian languages TRANSliteration */
  Itrans = 'ITRANS',
  /** Sanskrit Library Phonetic Basic */
  Slp1 = 'SLP1',
  Telugu = 'TELUGU',
  Tamil = 'TAMIL',
  Kannada = 'KANNADA'
}

/** user specific Settings */
export type Settings = {
  __typename?: 'Settings';
  id: Scalars['ID'];
  user: Scalars['ID'];
  content?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  /** user name */
  id: Scalars['ID'];
  displayName?: Maybe<Scalars['String']>;
  settings?: Maybe<Settings>;
};

export type GetEntitiesListQueryVariables = Exact<{
  type?: Maybe<Scalars['ID']>;
  language?: Maybe<Scalars['ID']>;
}>;


export type GetEntitiesListQuery = (
  { __typename?: 'Query' }
  & { entities?: Maybe<Array<(
    { __typename: 'Entity' }
    & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
    & { textData?: Maybe<Array<(
      { __typename: 'EntityText' }
      & Pick<EntityText, 'text'>
    )>> }
  )>> }
);

export type GetEntitiesByParentQueryVariables = Exact<{
  parent?: Maybe<Scalars['ID']>;
  type?: Maybe<Scalars['ID']>;
  language?: Maybe<Scalars['ID']>;
}>;


export type GetEntitiesByParentQuery = (
  { __typename?: 'Query' }
  & { subEntities?: Maybe<Array<(
    { __typename?: 'Entity' }
    & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
    & { entities?: Maybe<Array<(
      { __typename?: 'Entity' }
      & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
      & { textData?: Maybe<Array<(
        { __typename?: 'EntityText' }
        & Pick<EntityText, 'id' | 'text'>
      )>> }
    )>> }
  )>> }
);

export type GetEntityQueryVariables = Exact<{
  by: EntitiesBy;
}>;


export type GetEntityQuery = (
  { __typename?: 'Query' }
  & { entities?: Maybe<Array<(
    { __typename?: 'Entity' }
    & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
    & { type: (
      { __typename?: 'EntityType' }
      & Pick<EntityType, 'id'>
    ), textData?: Maybe<Array<(
      { __typename?: 'EntityText' }
      & Pick<EntityText, 'id' | 'text' | 'description'>
      & { language: (
        { __typename?: 'Language' }
        & Pick<Language, 'id' | 'iso'>
      ) }
    )>> }
  )>> }
);

export type UpdateEntityMutationVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
  entityData: EntityContentInput;
}>;


export type UpdateEntityMutation = (
  { __typename?: 'Mutation' }
  & { updateEntityContent: (
    { __typename?: 'Entity' }
    & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
    & { textData?: Maybe<Array<(
      { __typename?: 'EntityText' }
      & Pick<EntityText, 'id' | 'text' | 'description'>
    )>> }
  ) }
);

export type DeleteEntityMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteEntityMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteEntity'>
);

export type SearchEntitiesByTextQueryVariables = Exact<{
  text?: Maybe<Scalars['String']>;
}>;


export type SearchEntitiesByTextQuery = (
  { __typename?: 'Query' }
  & { entities?: Maybe<Array<(
    { __typename?: 'Entity' }
    & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
  )>> }
);

export type GetEntityChildrenByTypeQueryVariables = Exact<{
  id?: Maybe<Scalars['ID']>;
}>;


export type GetEntityChildrenByTypeQuery = (
  { __typename?: 'Query' }
  & { entities?: Maybe<Array<(
    { __typename?: 'Entity' }
    & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
    & { childTypes?: Maybe<Array<(
      { __typename?: 'EntityType' }
      & Pick<EntityType, 'id' | 'name'>
    )>> }
  )>> }
);

export type GetContentsOfEntityQueryVariables = Exact<{
  parent: Scalars['ID'];
  language: Scalars['ID'];
}>;


export type GetContentsOfEntityQuery = (
  { __typename?: 'Query' }
  & { contentLines?: Maybe<Array<(
    { __typename?: 'ContentLine' }
    & Pick<ContentLine, 'id' | 'content'>
    & { language: (
      { __typename?: 'Language' }
      & Pick<Language, 'id'>
    ) }
  )>> }
);

export type GetEntityContentsQueryVariables = Exact<{
  entityId?: Maybe<Scalars['ID']>;
  language: Scalars['ID'];
  meaningLanguage: Scalars['ID'];
}>;


export type GetEntityContentsQuery = (
  { __typename?: 'Query' }
  & { entities?: Maybe<Array<(
    { __typename?: 'Entity' }
    & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
    & { textData?: Maybe<Array<(
      { __typename?: 'EntityText' }
      & Pick<EntityText, 'id' | 'text'>
    )>>, childEntities?: Maybe<Array<(
      { __typename?: 'Entity' }
      & Pick<Entity, 'id' | 'defaultText' | 'defaultThumbnail'>
      & { type: (
        { __typename?: 'EntityType' }
        & Pick<EntityType, 'id' | 'name'>
      ), textData?: Maybe<Array<(
        { __typename?: 'EntityText' }
        & Pick<EntityText, 'id' | 'text'>
      )>>, content?: Maybe<Array<(
        { __typename?: 'ContentLine' }
        & Pick<ContentLine, 'id' | 'content'>
      )>>, contentMeaning?: Maybe<Array<(
        { __typename?: 'ContentMeaning' }
        & Pick<ContentMeaning, 'id' | 'content'>
      )>> }
    )>> }
  )>> }
);

export type UpdateContentMutationVariables = Exact<{
  withData?: Maybe<ContentLineInput>;
}>;


export type UpdateContentMutation = (
  { __typename?: 'Mutation' }
  & { updateContent: (
    { __typename?: 'ContentLine' }
    & Pick<ContentLine, 'id' | 'content'>
    & { language: (
      { __typename?: 'Language' }
      & Pick<Language, 'id'>
    ) }
  ) }
);

export type DeleteContentMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteContentMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteContent'>
);

export type GetContentMeaningsOfEntityQueryVariables = Exact<{
  parent: Scalars['ID'];
  language: Scalars['ID'];
}>;


export type GetContentMeaningsOfEntityQuery = (
  { __typename?: 'Query' }
  & { contentMeanings?: Maybe<Array<(
    { __typename?: 'ContentMeaning' }
    & Pick<ContentMeaning, 'id' | 'content'>
    & { language: (
      { __typename?: 'Language' }
      & Pick<Language, 'id'>
    ) }
  )>> }
);

export type UpdateContentMeaningMutationVariables = Exact<{
  withData?: Maybe<ContentMeaningInput>;
}>;


export type UpdateContentMeaningMutation = (
  { __typename?: 'Mutation' }
  & { updateContentMeaning: (
    { __typename?: 'ContentMeaning' }
    & Pick<ContentMeaning, 'id' | 'content'>
    & { language: (
      { __typename?: 'Language' }
      & Pick<Language, 'id'>
    ) }
  ) }
);

export type DeleteContentMeaningMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteContentMeaningMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteContentMeaning'>
);

export type GetLanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLanguagesQuery = (
  { __typename?: 'Query' }
  & { languages: Array<(
    { __typename?: 'Language' }
    & Pick<Language, 'id' | 'name'>
  )> }
);

export type GetEntityTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntityTypesQuery = (
  { __typename?: 'Query' }
  & { entityTypes: Array<(
    { __typename?: 'EntityType' }
    & Pick<EntityType, 'id' | 'name' | 'description'>
  )> }
);

export type SearchDictMeaningsQueryVariables = Exact<{
  fromDictionary?: Maybe<Dictionaries>;
  keys: Scalars['String'];
  maxHits?: Maybe<Scalars['Int']>;
  inputScheme?: Maybe<SanscriptScheme>;
  outputScheme?: Maybe<SanscriptScheme>;
  fuzzySearch?: Maybe<Scalars['Boolean']>;
}>;


export type SearchDictMeaningsQuery = (
  { __typename?: 'Query' }
  & { meanings?: Maybe<Array<(
    { __typename?: 'DictionaryItem' }
    & Pick<DictionaryItem, 'id' | 'key' | 'content'>
  )>> }
);

export type SanskritSandhiQueryVariables = Exact<{
  asDevanagari?: Maybe<Scalars['Boolean']>;
  splits: Array<Scalars['String']> | Scalars['String'];
}>;


export type SanskritSandhiQuery = (
  { __typename?: 'Query' }
  & { joins: Query['sanskritSandhi'] }
);

export type SanskritSplitsQueryVariables = Exact<{
  asDevanagari?: Maybe<Scalars['Boolean']>;
  content: Scalars['String'];
  maxPaths?: Maybe<Scalars['Int']>;
}>;


export type SanskritSplitsQuery = (
  { __typename?: 'Query' }
  & { splits: Query['sanskritSplits'] }
);

export type SearchDictKeysQueryVariables = Exact<{
  fromDictionary?: Maybe<Dictionaries>;
  key: Scalars['String'];
  searchInContent?: Maybe<Scalars['Boolean']>;
  maxHits?: Maybe<Scalars['Int']>;
  outputScheme?: Maybe<SanscriptScheme>;
  startsWith?: Maybe<Scalars['Boolean']>;
  endsWith?: Maybe<Scalars['Boolean']>;
}>;


export type SearchDictKeysQuery = (
  { __typename?: 'Query' }
  & { keywords?: Maybe<Array<(
    { __typename?: 'DictionaryItem' }
    & Pick<DictionaryItem, 'id' | 'key'>
  )>> }
);


export const GetEntitiesListDocument = gql`
    query getEntitiesList($type: ID, $language: ID) {
  entities: entities(by: {type: $type}) {
    id
    defaultText
    defaultThumbnail
    textData(language: $language) {
      text
      __typename
    }
    __typename
  }
}
    `;
export const GetEntitiesByParentDocument = gql`
    query getEntitiesByParent($parent: ID, $type: ID, $language: ID) {
  subEntities: entities(by: {id: $parent}) {
    id
    defaultText
    defaultThumbnail
    entities: childEntities(by: {type: $type}) {
      id
      defaultText
      defaultThumbnail
      textData(language: $language) {
        id
        text
      }
    }
  }
}
    `;
export const GetEntityDocument = gql`
    query getEntity($by: EntitiesBy!) {
  entities(by: $by) {
    id
    defaultText
    defaultThumbnail
    type {
      id
    }
    textData {
      id
      language {
        id
        iso
      }
      text
      description
    }
  }
}
    `;
export const UpdateEntityDocument = gql`
    mutation updateEntity($id: ID, $entityData: EntityContentInput!) {
  updateEntityContent(id: $id, withData: $entityData) {
    id
    defaultText
    defaultThumbnail
    textData {
      id
      text
      description
    }
  }
}
    `;
export const DeleteEntityDocument = gql`
    mutation deleteEntity($id: ID!) {
  deleteEntity(id: $id)
}
    `;
export const SearchEntitiesByTextDocument = gql`
    query searchEntitiesByText($text: String) {
  entities(by: {textLike: $text}) {
    id
    defaultText
    defaultThumbnail
  }
}
    `;
export const GetEntityChildrenByTypeDocument = gql`
    query getEntityChildrenByType($id: ID) {
  entities(by: {id: $id}) {
    id
    defaultText
    defaultThumbnail
    childTypes {
      id
      name
    }
  }
}
    `;
export const GetContentsOfEntityDocument = gql`
    query getContentsOfEntity($parent: ID!, $language: ID!) {
  contentLines(by: {parent: $parent, language: $language}) {
    id
    language {
      id
    }
    content
  }
}
    `;
export const GetEntityContentsDocument = gql`
    query getEntityContents($entityId: ID, $language: ID!, $meaningLanguage: ID!) {
  entities(by: {id: $entityId}) {
    id
    defaultText
    defaultThumbnail
    textData(language: $language) {
      id
      text
    }
    childEntities(by: {hasContentInLanguage: $language}) {
      id
      defaultText
      defaultThumbnail
      type {
        id
        name
      }
      textData(language: $language) {
        id
        text
      }
      content(language: $language) {
        id
        content
      }
      contentMeaning(language: $meaningLanguage) {
        id
        content
      }
    }
  }
}
    `;
export const UpdateContentDocument = gql`
    mutation updateContent($withData: ContentLineInput) {
  updateContent(withData: $withData) {
    id
    language {
      id
    }
    content
  }
}
    `;
export const DeleteContentDocument = gql`
    mutation deleteContent($id: ID!) {
  deleteContent(id: $id)
}
    `;
export const GetContentMeaningsOfEntityDocument = gql`
    query getContentMeaningsOfEntity($parent: ID!, $language: ID!) {
  contentMeanings(by: {parent: $parent, language: $language}) {
    id
    language {
      id
    }
    content
  }
}
    `;
export const UpdateContentMeaningDocument = gql`
    mutation updateContentMeaning($withData: ContentMeaningInput) {
  updateContentMeaning(withData: $withData) {
    id
    language {
      id
    }
    content
  }
}
    `;
export const DeleteContentMeaningDocument = gql`
    mutation deleteContentMeaning($id: ID!) {
  deleteContentMeaning(id: $id)
}
    `;
export const GetLanguagesDocument = gql`
    query getLanguages {
  languages {
    id
    name
  }
}
    `;
export const GetEntityTypesDocument = gql`
    query getEntityTypes {
  entityTypes {
    id
    name
    description
  }
}
    `;
export const SearchDictMeaningsDocument = gql`
    query searchDictMeanings($fromDictionary: Dictionaries, $keys: String!, $maxHits: Int, $inputScheme: SanscriptScheme, $outputScheme: SanscriptScheme, $fuzzySearch: Boolean) {
  meanings: dictionarySearch(
    searchWith: {origin: $fromDictionary, limit: $maxHits, fuzzySearch: $fuzzySearch, searchScheme: $inputScheme, outputScheme: $outputScheme, startsWith: true, endsWith: true, search: $keys}
  ) {
    id
    key
    content
  }
}
    `;
export const SanskritSandhiDocument = gql`
    query sanskritSandhi($asDevanagari: Boolean, $splits: [String!]!) {
  joins: sanskritSandhi(asDevanagari: $asDevanagari, splits: $splits)
}
    `;
export const SanskritSplitsDocument = gql`
    query sanskritSplits($asDevanagari: Boolean, $content: String!, $maxPaths: Int) {
  splits: sanskritSplits(
    asDevanagari: $asDevanagari
    maxPaths: $maxPaths
    content: $content
  )
}
    `;
export const SearchDictKeysDocument = gql`
    query SearchDictKeys($fromDictionary: Dictionaries, $key: String!, $searchInContent: Boolean, $maxHits: Int, $outputScheme: SanscriptScheme, $startsWith: Boolean, $endsWith: Boolean) {
  keywords: dictionarySearch(
    searchWith: {origin: $fromDictionary, fuzzySearch: $searchInContent, limit: $maxHits, outputScheme: $outputScheme, startsWith: $startsWith, endsWith: $endsWith, search: $key}
  ) {
    id
    key
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();
const GetEntitiesListDocumentString = print(GetEntitiesListDocument);
const GetEntitiesByParentDocumentString = print(GetEntitiesByParentDocument);
const GetEntityDocumentString = print(GetEntityDocument);
const UpdateEntityDocumentString = print(UpdateEntityDocument);
const DeleteEntityDocumentString = print(DeleteEntityDocument);
const SearchEntitiesByTextDocumentString = print(SearchEntitiesByTextDocument);
const GetEntityChildrenByTypeDocumentString = print(GetEntityChildrenByTypeDocument);
const GetContentsOfEntityDocumentString = print(GetContentsOfEntityDocument);
const GetEntityContentsDocumentString = print(GetEntityContentsDocument);
const UpdateContentDocumentString = print(UpdateContentDocument);
const DeleteContentDocumentString = print(DeleteContentDocument);
const GetContentMeaningsOfEntityDocumentString = print(GetContentMeaningsOfEntityDocument);
const UpdateContentMeaningDocumentString = print(UpdateContentMeaningDocument);
const DeleteContentMeaningDocumentString = print(DeleteContentMeaningDocument);
const GetLanguagesDocumentString = print(GetLanguagesDocument);
const GetEntityTypesDocumentString = print(GetEntityTypesDocument);
const SearchDictMeaningsDocumentString = print(SearchDictMeaningsDocument);
const SanskritSandhiDocumentString = print(SanskritSandhiDocument);
const SanskritSplitsDocumentString = print(SanskritSplitsDocument);
const SearchDictKeysDocumentString = print(SearchDictKeysDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEntitiesList(variables?: GetEntitiesListQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetEntitiesListQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesListQuery>(GetEntitiesListDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntitiesList');
    },
    getEntitiesByParent(variables?: GetEntitiesByParentQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetEntitiesByParentQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesByParentQuery>(GetEntitiesByParentDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntitiesByParent');
    },
    getEntity(variables: GetEntityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetEntityQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntityQuery>(GetEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntity');
    },
    updateEntity(variables: UpdateEntityMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UpdateEntityMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<UpdateEntityMutation>(UpdateEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateEntity');
    },
    deleteEntity(variables: DeleteEntityMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: DeleteEntityMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<DeleteEntityMutation>(DeleteEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteEntity');
    },
    searchEntitiesByText(variables?: SearchEntitiesByTextQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: SearchEntitiesByTextQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<SearchEntitiesByTextQuery>(SearchEntitiesByTextDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchEntitiesByText');
    },
    getEntityChildrenByType(variables?: GetEntityChildrenByTypeQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetEntityChildrenByTypeQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntityChildrenByTypeQuery>(GetEntityChildrenByTypeDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntityChildrenByType');
    },
    getContentsOfEntity(variables: GetContentsOfEntityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetContentsOfEntityQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetContentsOfEntityQuery>(GetContentsOfEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getContentsOfEntity');
    },
    getEntityContents(variables: GetEntityContentsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetEntityContentsQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntityContentsQuery>(GetEntityContentsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntityContents');
    },
    updateContent(variables?: UpdateContentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UpdateContentMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<UpdateContentMutation>(UpdateContentDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateContent');
    },
    deleteContent(variables: DeleteContentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: DeleteContentMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<DeleteContentMutation>(DeleteContentDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteContent');
    },
    getContentMeaningsOfEntity(variables: GetContentMeaningsOfEntityQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetContentMeaningsOfEntityQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetContentMeaningsOfEntityQuery>(GetContentMeaningsOfEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getContentMeaningsOfEntity');
    },
    updateContentMeaning(variables?: UpdateContentMeaningMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UpdateContentMeaningMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<UpdateContentMeaningMutation>(UpdateContentMeaningDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateContentMeaning');
    },
    deleteContentMeaning(variables: DeleteContentMeaningMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: DeleteContentMeaningMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<DeleteContentMeaningMutation>(DeleteContentMeaningDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteContentMeaning');
    },
    getLanguages(variables?: GetLanguagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetLanguagesQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetLanguagesQuery>(GetLanguagesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getLanguages');
    },
    getEntityTypes(variables?: GetEntityTypesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetEntityTypesQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntityTypesQuery>(GetEntityTypesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntityTypes');
    },
    searchDictMeanings(variables: SearchDictMeaningsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: SearchDictMeaningsQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<SearchDictMeaningsQuery>(SearchDictMeaningsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchDictMeanings');
    },
    sanskritSandhi(variables: SanskritSandhiQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: SanskritSandhiQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<SanskritSandhiQuery>(SanskritSandhiDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sanskritSandhi');
    },
    sanskritSplits(variables: SanskritSplitsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: SanskritSplitsQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<SanskritSplitsQuery>(SanskritSplitsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sanskritSplits');
    },
    SearchDictKeys(variables: SearchDictKeysQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: SearchDictKeysQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<SearchDictKeysQuery>(SearchDictKeysDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchDictKeys');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;


export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

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
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

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
  Bookmark: ResolverTypeWrapper<Bookmark>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  BookmarkByInput: BookmarkByInput;
  BookmarkInput: BookmarkInput;
  BookmarkUpdateInput: BookmarkUpdateInput;
  ContentExtras: ResolverTypeWrapper<ContentExtras>;
  ContentExtrasInput: ContentExtrasInput;
  ContentLine: ResolverTypeWrapper<ContentLine>;
  ContentLineInput: ContentLineInput;
  ContentLinesBy: ContentLinesBy;
  ContentMeaning: ResolverTypeWrapper<ContentMeaning>;
  ContentMeaningInput: ContentMeaningInput;
  ContentMeaningsBy: ContentMeaningsBy;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Dictionaries: Dictionaries;
  DictionaryItem: ResolverTypeWrapper<DictionaryItem>;
  DictionaryKey: ResolverTypeWrapper<DictionaryKey>;
  DictionarySearchInput: DictionarySearchInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  EntitiesBy: EntitiesBy;
  Entity: ResolverTypeWrapper<Entity>;
  EntityContentInput: EntityContentInput;
  EntityMeta: ResolverTypeWrapper<EntityMeta>;
  EntityMetaDataInput: EntityMetaDataInput;
  EntityRelation: ResolverTypeWrapper<EntityRelation>;
  EntityText: ResolverTypeWrapper<EntityText>;
  EntityTextDataInput: EntityTextDataInput;
  EntityType: ResolverTypeWrapper<EntityType>;
  Language: ResolverTypeWrapper<Language>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RelatedEntitiesBy: RelatedEntitiesBy;
  SanscriptScheme: SanscriptScheme;
  Settings: ResolverTypeWrapper<Settings>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Bookmark: Bookmark;
  ID: Scalars['ID'];
  String: Scalars['String'];
  BookmarkByInput: BookmarkByInput;
  BookmarkInput: BookmarkInput;
  BookmarkUpdateInput: BookmarkUpdateInput;
  ContentExtras: ContentExtras;
  ContentExtrasInput: ContentExtrasInput;
  ContentLine: ContentLine;
  ContentLineInput: ContentLineInput;
  ContentLinesBy: ContentLinesBy;
  ContentMeaning: ContentMeaning;
  ContentMeaningInput: ContentMeaningInput;
  ContentMeaningsBy: ContentMeaningsBy;
  Date: Scalars['Date'];
  DateTime: Scalars['DateTime'];
  DictionaryItem: DictionaryItem;
  DictionaryKey: DictionaryKey;
  DictionarySearchInput: DictionarySearchInput;
  Boolean: Scalars['Boolean'];
  Int: Scalars['Int'];
  EntitiesBy: EntitiesBy;
  Entity: Entity;
  EntityContentInput: EntityContentInput;
  EntityMeta: EntityMeta;
  EntityMetaDataInput: EntityMetaDataInput;
  EntityRelation: EntityRelation;
  EntityText: EntityText;
  EntityTextDataInput: EntityTextDataInput;
  EntityType: EntityType;
  Language: Language;
  Mutation: {};
  Query: {};
  RelatedEntitiesBy: RelatedEntitiesBy;
  Settings: Settings;
  User: User;
};

export type BookmarkResolvers<ContextType = any, ParentType extends ResolversParentTypes['Bookmark'] = ResolversParentTypes['Bookmark']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entity?: Resolver<Maybe<ResolversTypes['Entity']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentExtrasResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContentExtras'] = ResolversParentTypes['ContentExtras']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentLineResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContentLine'] = ResolversParentTypes['ContentLine']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parentEntity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  meaning?: Resolver<Maybe<ResolversTypes['ContentMeaning']>, ParentType, ContextType, RequireFields<ContentLineMeaningArgs, 'language'>>;
  extras?: Resolver<Maybe<ResolversTypes['ContentExtras']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ContentMeaningResolvers<ContextType = any, ParentType extends ResolversParentTypes['ContentMeaning'] = ResolversParentTypes['ContentMeaning']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parent?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DictionaryItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['DictionaryItem'] = ResolversParentTypes['DictionaryItem']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fromDictionary?: Resolver<ResolversTypes['Dictionaries'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DictionaryKeyResolvers<ContextType = any, ParentType extends ResolversParentTypes['DictionaryKey'] = ResolversParentTypes['DictionaryKey']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  devanagari?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  order?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  defaultText?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  defaultThumbnail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  childEntities?: Resolver<Maybe<Array<ResolversTypes['Entity']>>, ParentType, ContextType, RequireFields<EntityChildEntitiesArgs, never>>;
  parentEntities?: Resolver<Maybe<Array<ResolversTypes['Entity']>>, ParentType, ContextType, RequireFields<EntityParentEntitiesArgs, never>>;
  textData?: Resolver<Maybe<Array<ResolversTypes['EntityText']>>, ParentType, ContextType, RequireFields<EntityTextDataArgs, never>>;
  metaData?: Resolver<Maybe<Array<ResolversTypes['EntityMeta']>>, ParentType, ContextType>;
  content?: Resolver<Maybe<Array<ResolversTypes['ContentLine']>>, ParentType, ContextType, RequireFields<EntityContentArgs, 'language'>>;
  contentMeaning?: Resolver<Maybe<Array<ResolversTypes['ContentMeaning']>>, ParentType, ContextType, RequireFields<EntityContentMeaningArgs, 'language'>>;
  childTypes?: Resolver<Maybe<Array<ResolversTypes['EntityType']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityMetaResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityMeta'] = ResolversParentTypes['EntityMeta']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parentEntity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityRelationResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityRelation'] = ResolversParentTypes['EntityRelation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  fromEntity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  fromType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  toEntity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  toType?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityTextResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityText'] = ResolversParentTypes['EntityText']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  parentEntity?: Resolver<ResolversTypes['Entity'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['EntityType'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EntityTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['EntityType'] = ResolversParentTypes['EntityType']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LanguageResolvers<ContextType = any, ParentType extends ResolversParentTypes['Language'] = ResolversParentTypes['Language']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  iso?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  updateBookmark?: Resolver<ResolversTypes['Bookmark'], ParentType, ContextType, RequireFields<MutationUpdateBookmarkArgs, 'withData'>>;
  deleteBookmark?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteBookmarkArgs, 'id'>>;
  deleteEntity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteEntityArgs, 'id'>>;
  updateEntityContent?: Resolver<ResolversTypes['Entity'], ParentType, ContextType, RequireFields<MutationUpdateEntityContentArgs, 'withData'>>;
  updateContent?: Resolver<ResolversTypes['ContentLine'], ParentType, ContextType, RequireFields<MutationUpdateContentArgs, never>>;
  deleteContent?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteContentArgs, 'id'>>;
  updateContentMeaning?: Resolver<ResolversTypes['ContentMeaning'], ParentType, ContextType, RequireFields<MutationUpdateContentMeaningArgs, never>>;
  deleteContentMeaning?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteContentMeaningArgs, 'id'>>;
  updateSettings?: Resolver<ResolversTypes['Settings'], ParentType, ContextType, RequireFields<MutationUpdateSettingsArgs, 'user' | 'content'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  entityTypes?: Resolver<Array<ResolversTypes['EntityType']>, ParentType, ContextType>;
  languages?: Resolver<Array<ResolversTypes['Language']>, ParentType, ContextType>;
  entities?: Resolver<Maybe<Array<ResolversTypes['Entity']>>, ParentType, ContextType, RequireFields<QueryEntitiesArgs, 'by'>>;
  contentLines?: Resolver<Maybe<Array<ResolversTypes['ContentLine']>>, ParentType, ContextType, RequireFields<QueryContentLinesArgs, 'by'>>;
  contentMeanings?: Resolver<Maybe<Array<ResolversTypes['ContentMeaning']>>, ParentType, ContextType, RequireFields<QueryContentMeaningsArgs, 'by'>>;
  bookmarks?: Resolver<Maybe<Array<ResolversTypes['Bookmark']>>, ParentType, ContextType, RequireFields<QueryBookmarksArgs, never>>;
  dictionarySearch?: Resolver<Maybe<Array<ResolversTypes['DictionaryItem']>>, ParentType, ContextType, RequireFields<QueryDictionarySearchArgs, 'searchWith'>>;
  dictionaryKeySearch?: Resolver<Array<ResolversTypes['DictionaryKey']>, ParentType, ContextType, RequireFields<QueryDictionaryKeySearchArgs, 'key' | 'maxHits' | 'asDevanagari' | 'searchContent' | 'fuzzySearch'>>;
  dictionaryMeanings?: Resolver<Array<ResolversTypes['DictionaryItem']>, ParentType, ContextType, RequireFields<QueryDictionaryMeaningsArgs, 'keys' | 'asDevanagari' | 'maxHits'>>;
  sanskritSplits?: Resolver<Maybe<Array<Maybe<Array<ResolversTypes['String']>>>>, ParentType, ContextType, RequireFields<QuerySanskritSplitsArgs, 'content' | 'maxPaths' | 'asDevanagari'>>;
  sanskritSandhi?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType, RequireFields<QuerySanskritSandhiArgs, 'splits' | 'asDevanagari'>>;
};

export type SettingsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Settings'] = ResolversParentTypes['Settings']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['Settings']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Bookmark?: BookmarkResolvers<ContextType>;
  ContentExtras?: ContentExtrasResolvers<ContextType>;
  ContentLine?: ContentLineResolvers<ContextType>;
  ContentMeaning?: ContentMeaningResolvers<ContextType>;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DictionaryItem?: DictionaryItemResolvers<ContextType>;
  DictionaryKey?: DictionaryKeyResolvers<ContextType>;
  Entity?: EntityResolvers<ContextType>;
  EntityMeta?: EntityMetaResolvers<ContextType>;
  EntityRelation?: EntityRelationResolvers<ContextType>;
  EntityText?: EntityTextResolvers<ContextType>;
  EntityType?: EntityTypeResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Settings?: SettingsResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
