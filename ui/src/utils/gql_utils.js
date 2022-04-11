import { Parser, TreeToGraphQL } from 'graphql-js-tree'

export function gqlParse( { code, libraries = '' } ) {
  const tree = Parser.parse( code, [], libraries )
  const parsed = TreeToGraphQL.parse( tree )
  // console.log( parsed )
  return parsed
}