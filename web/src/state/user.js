import { atom } from 'recoil'

const user = atom({
  key: 'user',
  default: {
    name: '',
    displayName: ''
  }
})

export default user