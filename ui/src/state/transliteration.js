import { atom } from "recoil";

export const transliterationState = atom( {
  key: 'transliterationState',
  default: {
    fromTextLang: 'slp1',
    toTextLang: 'telugu',
    fromText: '',
    toText: '',
  },
} );