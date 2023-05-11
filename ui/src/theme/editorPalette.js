import palette from './palette'
import { DarkTheme, LightTheme } from "graphql-editor"

const darkTheme = {
  ...DarkTheme,
  background: {
    ...DarkTheme.background,
    mainFar: palette.dark.background.paper,
  }
}

const lightTheme = {
  ...LightTheme,
  background: {
    ...LightTheme.background,
    mainFar: palette.light.background.paper,
  }
}

const theme = { 'light': lightTheme, 'dark': darkTheme }
export default theme