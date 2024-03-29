import { GraphQLResolveInfo } from 'graphql';
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
};

export type Entity = {
  __typename?: 'Entity';
  text: Scalars['String'];
};

export type EntityCreateInput = {
  text: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  version: Scalars['String'];
  createEntity: Scalars['ID'];
};


export type MutationCreateEntityArgs = {
  withData?: Maybe<EntityCreateInput>;
};

export type Query = {
  __typename?: 'Query';
  version: Scalars['String'];
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

export type GetVersionQueryVariables = Exact<{ [key: string]: never; }>;


export type GetVersionQuery = (
  { __typename?: 'Query' }
  & Pick<Query, 'version'>
);


export const GetVersionDocument = gql`
    query getVersion {
  version
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();
const GetVersionDocumentString = print(GetVersionDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getVersion(variables?: GetVersionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: GetVersionQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetVersionQuery>(GetVersionDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getVersion');
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
  Entity: ResolverTypeWrapper<Entity>;
  String: ResolverTypeWrapper<Scalars['String']>;
  EntityCreateInput: EntityCreateInput;
  Mutation: ResolverTypeWrapper<{}>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Query: ResolverTypeWrapper<{}>;
  SanscriptScheme: SanscriptScheme;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Entity: Entity;
  String: Scalars['String'];
  EntityCreateInput: EntityCreateInput;
  Mutation: {};
  ID: Scalars['ID'];
  Query: {};
  Boolean: Scalars['Boolean'];
};

export type EntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createEntity?: Resolver<ResolversTypes['ID'], ParentType, ContextType, RequireFields<MutationCreateEntityArgs, never>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Entity?: EntityResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
