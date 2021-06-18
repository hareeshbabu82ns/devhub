import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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

export enum SanscriptScheme {
  Devanagari = 'DEVANAGARI',
  Iast = 'IAST',
  Itrans = 'ITRANS',
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

export type CreateEntityMutationVariables = Exact<{
  data?: Maybe<EntityCreateInput>;
}>;


export type CreateEntityMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'createEntity'>
);


export const GetVersionDocument = gql`
    query getVersion {
  version
}
    `;

/**
 * __useGetVersionQuery__
 *
 * To run a query within a React component, call `useGetVersionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVersionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVersionQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetVersionQuery(baseOptions?: Apollo.QueryHookOptions<GetVersionQuery, GetVersionQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVersionQuery, GetVersionQueryVariables>(GetVersionDocument, options);
      }
export function useGetVersionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVersionQuery, GetVersionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVersionQuery, GetVersionQueryVariables>(GetVersionDocument, options);
        }
export type GetVersionQueryHookResult = ReturnType<typeof useGetVersionQuery>;
export type GetVersionLazyQueryHookResult = ReturnType<typeof useGetVersionLazyQuery>;
export type GetVersionQueryResult = Apollo.QueryResult<GetVersionQuery, GetVersionQueryVariables>;
export const CreateEntityDocument = gql`
    mutation createEntity($data: EntityCreateInput) {
  createEntity(withData: $data)
}
    `;
export type CreateEntityMutationFn = Apollo.MutationFunction<CreateEntityMutation, CreateEntityMutationVariables>;

/**
 * __useCreateEntityMutation__
 *
 * To run a mutation, you first call `useCreateEntityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntityMutation, { data, loading, error }] = useCreateEntityMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateEntityMutation(baseOptions?: Apollo.MutationHookOptions<CreateEntityMutation, CreateEntityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEntityMutation, CreateEntityMutationVariables>(CreateEntityDocument, options);
      }
export type CreateEntityMutationHookResult = ReturnType<typeof useCreateEntityMutation>;
export type CreateEntityMutationResult = Apollo.MutationResult<CreateEntityMutation>;
export type CreateEntityMutationOptions = Apollo.BaseMutationOptions<CreateEntityMutation, CreateEntityMutationVariables>;