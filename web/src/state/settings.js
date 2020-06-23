import { atom } from 'recoil'

const settings = atom({
  key: 'settings',
  default: {
    language: '1', //sanskrit
    meaningLanguage: '3', //english
    fontSize: 2, //in em
    inverted: true,
  }
})

export default settings