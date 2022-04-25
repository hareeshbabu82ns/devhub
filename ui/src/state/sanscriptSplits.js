import { atom } from "recoil"

export const sanscriptSplitsState = atom( {
  key: 'sanscriptSplitsState',
  default: {
    splitsOrJoins: 'splits', // splits , joins
    drawerOpened: false,
    inputScheme: 'SLP1',
    outputScheme: 'TELUGU',
    inputText: 'namaH SivAByAM navayOvanAByAM  parasparASlizwavapurDarAByAm',
    inputWords: 'paraspara,ASlizwa',
    // inputText: '',
    limit: 10,
    strictIO: false,
    splitsData: [],
    joinsData: [],
  },
} )