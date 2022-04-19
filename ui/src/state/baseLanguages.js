import { selector } from "recoil"
import { fetchAllLanguages } from "../utils/gql_utils"

export const baseLanguagesState = selector( {
  key: 'baseLanguages',
  default: [],
  get: async () => {
    const languages = await fetchAllLanguages()
    return languages
  }
} )
