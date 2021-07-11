import { GraphQLResolveInfo } from 'graphql';
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
};

export type Entity = {
  __typename?: 'Entity';
  id: Scalars['ID'];
  text: Scalars['String'];
};

export type EntityInput = {
  text?: Maybe<Scalars['String']>;
};

export type EntityType = {
  __typename?: 'EntityType';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type EntityTypeInput = {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type FilterBoolean = {
  operation?: Maybe<FilterOperation>;
  path?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Boolean']>;
  valueList?: Maybe<Array<Scalars['Boolean']>>;
};

export type FilterFloat = {
  operation?: Maybe<FilterOperation>;
  path?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
  valueList?: Maybe<Array<Scalars['Float']>>;
};

export type FilterId = {
  operation?: Maybe<FilterOperation>;
  path?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['ID']>;
  valueList?: Maybe<Array<Scalars['ID']>>;
};

export type FilterInt = {
  operation?: Maybe<FilterOperation>;
  path?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
  valueList?: Maybe<Array<Scalars['Int']>>;
};

export enum FilterOperation {
  Equals = 'EQUALS',
  NotEquals = 'NOT_EQUALS',
  GreaterThan = 'GREATER_THAN',
  GreaterThanEquals = 'GREATER_THAN_EQUALS',
  LessThan = 'LESS_THAN',
  LessThanEquals = 'LESS_THAN_EQUALS',
  In = 'IN',
  NotIn = 'NOT_IN',
  Regex = 'REGEX',
  All = 'ALL'
}

export type FilterString = {
  operation?: Maybe<FilterOperation>;
  path?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  valueList?: Maybe<Array<Scalars['String']>>;
};

export type Language = {
  __typename?: 'Language';
  id: Scalars['ID'];
  iso: Scalars['String'];
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
};

export type LanguageInput = {
  iso?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type LanguageSearchInput = {
  id?: Maybe<FilterId>;
  iso?: Maybe<FilterString>;
  name?: Maybe<FilterString>;
  description?: Maybe<FilterString>;
  and?: Maybe<Array<LanguageSearchInput>>;
  or?: Maybe<Array<LanguageSearchInput>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createEntity: Scalars['ID'];
  createEntityType: Scalars['ID'];
  createLanguage: Scalars['ID'];
  deleteEntity: Scalars['ID'];
  deleteEntityType: Scalars['ID'];
  deleteLanguage: Scalars['ID'];
  init: Scalars['String'];
  updateEntity: Scalars['ID'];
  updateEntityType: Scalars['ID'];
  updateLanguage: Scalars['ID'];
  version: Scalars['String'];
};


export type MutationCreateEntityArgs = {
  withData?: Maybe<EntityInput>;
};


export type MutationCreateEntityTypeArgs = {
  withData?: Maybe<EntityTypeInput>;
};


export type MutationCreateLanguageArgs = {
  withData?: Maybe<LanguageInput>;
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


export type MutationUpdateEntityArgs = {
  id: Scalars['ID'];
  withData?: Maybe<EntityInput>;
};


export type MutationUpdateEntityTypeArgs = {
  id: Scalars['ID'];
  withData?: Maybe<EntityTypeInput>;
};


export type MutationUpdateLanguageArgs = {
  id: Scalars['ID'];
  withData?: Maybe<LanguageInput>;
};

export type Query = {
  __typename?: 'Query';
  entities: Array<Entity>;
  entityTypes: Array<EntityType>;
  languages: Array<Language>;
  me: User;
  version: Scalars['String'];
};


export type QueryLanguagesArgs = {
  by?: Maybe<LanguageSearchInput>;
  limit?: Maybe<Scalars['Int']>;
};

export enum SanscriptScheme {
  Devanagari = 'DEVANAGARI',
  Iast = 'IAST',
  Itrans = 'ITRANS',
  Slp1 = 'SLP1',
  Telugu = 'TELUGU',
  Tamil = 'TAMIL',
  Kannada = 'KANNADA'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  displayName?: Maybe<Scalars['String']>;
  settings?: Maybe<Scalars['String']>;
};



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
  Entity: ResolverTypeWrapper<Entity>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  EntityInput: EntityInput;
  EntityType: ResolverTypeWrapper<EntityType>;
  EntityTypeInput: EntityTypeInput;
  FilterBoolean: FilterBoolean;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  FilterFloat: FilterFloat;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FilterID: FilterId;
  FilterInt: FilterInt;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  FilterOperation: FilterOperation;
  FilterString: FilterString;
  Language: ResolverTypeWrapper<Language>;
  LanguageInput: LanguageInput;
  LanguageSearchInput: LanguageSearchInput;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SanscriptScheme: SanscriptScheme;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Entity: Entity;
  ID: Scalars['ID'];
  String: Scalars['String'];
  EntityInput: EntityInput;
  EntityType: EntityType;
  EntityTypeInput: EntityTypeInput;
  FilterBoolean: FilterBoolean;
  Boolean: Scalars['Boolean'];
  FilterFloat: FilterFloat;
  Float: Scalars['Float'];
  FilterID: FilterId;
  FilterInt: FilterInt;
  Int: Scalars['Int'];
  FilterString: FilterString;
  Language: Language;
  LanguageInput: LanguageInput;
  LanguageSearchInput: LanguageSearchInput;
  Mutation: {};
  Query: {};
  User: User;
};

export type EntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  createEntity?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationCreateEntityArgs, never>>;
  createEntityType?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationCreateEntityTypeArgs, never>>;
  createLanguage?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationCreateLanguageArgs, never>>;
  deleteEntity?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteEntityArgs, 'id'>>;
  deleteEntityType?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteEntityTypeArgs, 'id'>>;
  deleteLanguage?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationDeleteLanguageArgs, 'id'>>;
  init?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updateEntity?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationUpdateEntityArgs, 'id'>>;
  updateEntityType?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationUpdateEntityTypeArgs, 'id'>>;
  updateLanguage?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationUpdateLanguageArgs, 'id'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  entities?: Resolver<Array<ResolversTypes['Entity']>, ParentType, ContextType>;
  entityTypes?: Resolver<Array<ResolversTypes['EntityType']>, ParentType, ContextType>;
  languages?: Resolver<Array<ResolversTypes['Language']>, ParentType, ContextType, RequireFields<QueryLanguagesArgs, 'limit'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  settings?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Entity?: EntityResolvers<ContextType>;
  EntityType?: EntityTypeResolvers<ContextType>;
  Language?: LanguageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
