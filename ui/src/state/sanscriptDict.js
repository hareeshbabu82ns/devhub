import { atom } from "recoil"

export const sanscriptDictState = atom( {
  key: 'sanscriptDictState',
  default: {
    drawerOpened: false,
    dictDetailsOpened: false,
    inputScheme: 'SLP1',
    outputScheme: 'TELUGU',
    inputText: '',
    limit: 10,
    origin: [],
    fuzzySearch: false,
    searchOnlyKeys: false,
    caseInsensitive: false,
    startsWith: true,
    endsWith: false,
  },
} )