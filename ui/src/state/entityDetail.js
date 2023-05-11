import { atom } from "recoil"

export const entityDetailState = atom( {
  key: 'entityDetailState',
  default: {
    drawerOpened: false,
    entityId: undefined,
  },
} )