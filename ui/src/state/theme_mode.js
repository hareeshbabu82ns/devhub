import { atom } from "recoil";

export const THEME_DARK = 'dark'
export const THEME_LIGHT = 'light'

export const themeModeState = atom({
  key: 'appTheme',
  default: THEME_LIGHT,
});