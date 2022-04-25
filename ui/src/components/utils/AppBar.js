import { styled } from '@mui/material/styles'
import { Stack, Typography, Tooltip } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import DictionaryIcon from '@mui/icons-material/MenuBook'
import SplitsIcon from '@mui/icons-material/AltRoute'
import SwapIcon from '@mui/icons-material/SwapHorizOutlined'
import LanguageSelect from './LanguageSelect'
import { APP_THEME_MODE, drawerWidth } from '../../constants'

import { useRecoilState, useSetRecoilState } from 'recoil'

import { drawerState } from './Drawer'
import ThemeUISwitch from './ThemeModeSwitch'
import { themeModeState, THEME_DARK, THEME_LIGHT } from '../../state/theme_mode'
import { transliterationState } from '../../state/transliteration'
import { sanscriptDictState } from '../../state/sanscriptDict'
import { sanscriptSplitsState } from '../../state/sanscriptSplits'

const AppBarStyled = styled( MuiAppBar, {
  shouldForwardProp: ( prop ) => prop !== 'open',
} )( ( { theme, open } ) => ( {
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create( [ 'width', 'margin' ], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  } ),
  ...( open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create( [ 'width', 'margin' ], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    } ),
  } ),
} ) )

function AppBar( { open } ) {
  const setTransliteration = useSetRecoilState( transliterationState )
  const setSansDict = useSetRecoilState( sanscriptDictState )
  const setSansSplits = useSetRecoilState( sanscriptSplitsState )
  const [ themeMode, setThemeMode ] = useRecoilState( themeModeState )
  const setDrawerState = useSetRecoilState( drawerState )
  function toggleDrawer() {
    setDrawerState( currentState => !currentState )
  }
  return (
    <AppBarStyled position="absolute" open={open} enableColorOnDark={true}>
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...( open && { display: 'none' } ),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          DevHub
        </Typography>
        <Stack direction="row">
          <LanguageSelect />
          {/* <ThemeUISwitch checked={themeMode === THEME_DARK}
            onChange={( event, checked ) => {
              const themeMode = checked ? THEME_DARK : THEME_LIGHT
              localStorage.setItem( APP_THEME_MODE, themeMode )
              setThemeMode( themeMode )
            }} /> */}
          <Tooltip title="Transliteration (CTRL+t)">
            <IconButton aria-label="transliteration"
              onClick={() => setTransliteration( s => ( { ...s, drawerOpened: !s.drawerOpened } ) )}>
              <SwapIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dictionary (CTRL+d)">
            <IconButton aria-label="sanskrit dictionary"
              onClick={() => setSansDict( s => ( { ...s, drawerOpened: !s.drawerOpened } ) )}>
              <DictionaryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Splits (CTRL+s)">
            <IconButton aria-label="sanskrit scentence splits"
              onClick={() => setSansSplits( s => ( { ...s, drawerOpened: !s.drawerOpened } ) )}>
              <SplitsIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBarStyled>
  )
}

export default AppBar