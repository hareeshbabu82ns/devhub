import { selectorFamily } from "recoil"
import { fetchAllEntityTypes } from "../utils/gql_utils"
// import { languageState } from "./language"

// For Selector with Parameters
// usage: const entityTypes = useRecoilValue( entityTypesState( 'SAN' ) ) )

export const entityTypesState = selectorFamily( {
  key: 'entityTypes',
  default: [],
  get: language => async () => {
    const types = await fetchAllEntityTypes( { language } )
    return types
  }
} )

// For Selector without Parameters
// usage: const entityTypes = useRecoilValue( entityTypesState ) )

// export const entityTypesState = selector( {
//   key: 'entityTypes',
//   default: [],
//   get: async ( { get } ) => {
//     const types = await fetchAllEntityTypes( { language: get( languageState ) } )
//     return types
//   }
// } )