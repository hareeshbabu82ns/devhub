import { atom } from "recoil";

export const transliterationState = atom( {
  key: 'transliterationState',
  default: {
    drawerOpened: false,
    fromTextLang: 'slp1',
    toTextLang: 'telugu',
    fromText: '',
    toText: '',
  },
} );