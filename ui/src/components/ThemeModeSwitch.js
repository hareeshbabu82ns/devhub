import { useRecoilState } from 'recoil';
import ThemeUISwitch from './ThemeUISwitch';
import { themeModeState, THEME_DARK, THEME_LIGHT } from '../state/theme_mode';

const ThemeModeSwitch = () => {
  const [themeMode, setThemeMode] = useRecoilState(themeModeState)
  return (
    <ThemeUISwitch checked={themeMode === THEME_DARK}
      onChange={(_, checked) => setThemeMode(checked ? THEME_DARK : THEME_LIGHT)} />
  )
}

export default ThemeModeSwitch