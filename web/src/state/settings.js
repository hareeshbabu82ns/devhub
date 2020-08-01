import { atom } from 'recoil'

const settings = atom({
  key: 'settings',
  default: {
    language: '1', //sanskrit
    meaningLanguage: '2', //telugu
    fontSize: 2, //in em
    inverted: true,
    appSideBarVisible: false,
  }
})

export default settings