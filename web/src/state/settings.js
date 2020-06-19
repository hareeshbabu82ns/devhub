import { atom } from 'recoil'

const settings = atom({
  key: 'settings',
  default: {
    language: '1', //sanskrit
    fontSize: 1, //in em
  }
})

export default settings