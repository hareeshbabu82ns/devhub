import { atom } from "recoil";

export const contentFont = atom( {
  key: 'contentFont',
  default: { fontSize: 25, letterSpacing: 1.5, lineHeight: 1.8, },
} );