import { atom } from 'recoil'

const settings = atom({
  key: 'settings',
  default: {
    language: '1' //sanskrit
  }
})

export default settings