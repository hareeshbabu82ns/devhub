import { styled } from '@mui/material/styles'
import { Stack, Typography, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import DictionaryIcon from '@mui/icons-material/MenuBook'
import SplitsIcon from '@mui/icons-material/AltRoute'
import SwapIcon from '@mui/icons-material/SwapHorizOutlined'
import MoreMenuIcon from '@mui/icons-material/MoreVert'
import TextIncrease from '@mui/icons-material/TextIncrease'
import TextDecrease from '@mui/icons-material/TextDecrease'
import LanguageSelect from './LanguageSelect'
import { APP_THEME_MODE, C_LANGUAGE_DEFAULT, C_TRANSLATE_TEXT_MAP, drawerWidth } from '../../constants'

import { useRecoilState, useSetRecoilState } from 'recoil'

import { drawerState } from './Drawer'
import ThemeUISwitch from './ThemeModeSwitch'
import { themeModeState, THEME_DARK, THEME_LIGHT } from '../../state/theme_mode'
import { transliterationState } from '../../state/transliteration'
import { sanscriptDictState } from '../../state/sanscriptDict'
import { sanscriptSplitsState } from '../../state/sanscriptSplits'
import { getSelectionText } from '../../utils/utils'
import _ from 'lodash'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { contentFont } from '../../state/contentFont'

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
  const [ searchParams ] = useSearchParams()
  const setTransliteration = useSetRecoilState( transliterationState )
  const setSansDict = useSetRecoilState( sanscriptDictState )
  const setSansSplits = useSetRecoilState( sanscriptSplitsState )
  const [ themeMode, setThemeMode ] = useRecoilState( themeModeState )
  const setDrawerState = useSetRecoilState( drawerState )
  const setContentFont = useSetRecoilState( contentFont )

  function toggleDrawer() {
    setDrawerState( currentState => !currentState )
  }
  const drawerStateUpdater = s => ( {
    ...s, drawerOpened: !s.drawerOpened, inputText: getSelectionText() || s.inputText,
    inputScheme: _.find( C_TRANSLATE_TEXT_MAP, { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT } )?.value?.toUpperCase()
  } )
  const drawerStateUpdaterTrans = s => ( {
    ...s, drawerOpened: !s.drawerOpened, fromText: getSelectionText() || s.fromText,
    fromTextLang: _.find( C_TRANSLATE_TEXT_MAP, { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT } )?.value,
  } )

  const [ userMenuAnchorEl, setUserMenuAnchorEl ] = useState( null );

  const handleUserMenu = ( event ) => {
    setUserMenuAnchorEl( event.currentTarget );
  };

  const handleUserMenuClose = ( eventId ) => {
    setUserMenuAnchorEl( null );
    switch ( eventId ) {
      case 'contentFont+':
        setContentFont( s => ( { ...s, fontSize: s.fontSize + 2 } ) )
        break;
      case 'contentFont-':
        setContentFont( s => ( { ...s, fontSize: s.fontSize - 2 } ) )
        break;
      case 'transliteration':
        setTransliteration( drawerStateUpdaterTrans )
        break;
      case 'dictionary':
        setSansDict( drawerStateUpdater )
        break;
      case 'splits':
        setSansSplits( drawerStateUpdater )
        break;
      default:

    }
  };

  const overflowMenu = <Menu
    id="menu-appbar"
    anchorEl={userMenuAnchorEl}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    keepMounted
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    PaperProps={{
      style: {
        width: '30ch',
        padding: '4px'
      },
      elevation: 0,
      sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1,
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1,
        },
        '&:before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: 'background.paper',
          transform: 'translateY(-50%) rotate(45deg)',
          zIndex: 0,
        },
      },
    }}
    open={Boolean( userMenuAnchorEl )}
    onClose={() => handleUserMenuClose( null )}
  >
    <MenuItem onClick={() => handleUserMenuClose( 'transliteration' )}>
      <ListItemIcon>
        <SwapIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Transliteration</ListItemText>
      <Typography variant="body2" color="text.secondary">
        ^T
      </Typography>
    </MenuItem>
    <MenuItem onClick={() => handleUserMenuClose( 'dictionary' )}>
      <ListItemIcon>
        <DictionaryIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Dictionary</ListItemText>
      <Typography variant="body2" color="text.secondary">
        ^D
      </Typography>
    </MenuItem>
    <MenuItem onClick={() => handleUserMenuClose( 'splits' )}>
      <ListItemIcon>
        <SplitsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Splits</ListItemText>
      <Typography variant="body2" color="text.secondary">
        ^S
      </Typography>
    </MenuItem>
    <Divider sx={{ my: 0.5 }} />

    <MenuItem onClick={() => handleUserMenuClose( 'contentFont+' )}>
      <ListItemIcon>
        <TextIncrease fontSize="small" />
      </ListItemIcon>
      <ListItemText>Increase Font</ListItemText>
      <Typography variant="body2" color="text.secondary">
      </Typography>
    </MenuItem>

    <MenuItem onClick={() => handleUserMenuClose( 'contentFont-' )}>
      <ListItemIcon>
        <TextDecrease fontSize="small" />
      </ListItemIcon>
      <ListItemText>Decrease Font</ListItemText>
      <Typography variant="body2" color="text.secondary">
      </Typography>
    </MenuItem>
  </Menu>

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

          {/* <Tooltip title="Transliteration (CTRL+t)">
            <IconButton aria-label="transliteration"
              onClick={() => setTransliteration( drawerStateUpdaterTrans )}>
              <SwapIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dictionary (CTRL+d)">
            <IconButton aria-label="sanskrit dictionary"
              onClick={() => setSansDict( drawerStateUpdater )}>
              <DictionaryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Splits (CTRL+s)">
            <IconButton aria-label="sanskrit scentence splits"
              onClick={() => setSansSplits( drawerStateUpdater )}>
              <SplitsIcon />
            </IconButton>
          </Tooltip> */}

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleUserMenu}
            color="inherit"
          >
            <MoreMenuIcon />
          </IconButton>
          {overflowMenu}
        </Stack>
      </Toolbar>
    </AppBarStyled>
  )
}

export default AppBar