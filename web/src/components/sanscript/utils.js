import { schemes } from '@sanskrit-coders/sanscript'

import * as _ from 'lodash'

function zipper(objValue, srcValue) {
  //   if (_.isArray(objValue)) {
  return _.zip(objValue ? objValue : [], srcValue ? srcValue : []);
  //   }
}
export const mapSchemes = (fromSchemeName, toSchemeName) => {
  const fromScheme = schemes[fromSchemeName]
  const toScheme = schemes[toSchemeName]

  if (!fromScheme || !toScheme) Error('Provide a supported scheme')

  const merged = Object.assign({}, fromScheme)
  return _.mergeWith(merged, toScheme, zipper)
}
