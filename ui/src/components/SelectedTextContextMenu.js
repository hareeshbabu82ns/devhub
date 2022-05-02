import { ListItemIcon, ListItemText, MenuItem, MenuList } from "@mui/material"
import _ from "lodash"
import { useSearchParams } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { C_LANGUAGE_DEFAULT, C_TRANSLATE_TEXT_MAP } from "../constants"
import { sanscriptDictState } from "../state/sanscriptDict"
import { sanscriptSplitsState } from "../state/sanscriptSplits"
import { transliterationState } from "../state/transliteration"
import Panel from "./utils/Panel"

import DictionaryIcon from '@mui/icons-material/MenuBook'
import SplitsIcon from '@mui/icons-material/AltRoute'
import SwapIcon from '@mui/icons-material/SwapHorizOutlined'

const SelectedTextContextMenu = ( { anchorPoint, selectedText } ) => {
  const [ searchParams ] = useSearchParams()
  const setTransliteration = useSetRecoilState( transliterationState )
  const setSansDict = useSetRecoilState( sanscriptDictState )
  const setSansSplits = useSetRecoilState( sanscriptSplitsState )

  const drawerStateUpdater = s => ( {
    ...s, drawerOpened: true, inputText: selectedText,
    inputScheme: _.find( C_TRANSLATE_TEXT_MAP, { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT } )?.value?.toUpperCase()
  } )
  const drawerStateUpdaterTrans = s => ( {
    ...s, drawerOpened: true, fromText: selectedText,
    // fromTextLang: 'telugu',
    fromTextLang: _.find( C_TRANSLATE_TEXT_MAP, { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT } )?.value,
    // fromTextLang: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT
  } )

  return (
    <Panel
      title={selectedText?.substring( 0, 15 ).concat( '...' )}
      sx={{ top: anchorPoint.y, left: anchorPoint.x, position: 'absolute', m: 0, p: 0, zIndex: 1400 }}>
      <MenuList>

        <MenuItem onClick={() => setSansDict( drawerStateUpdater )}>
          <ListItemIcon>
            <DictionaryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Dictionary</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setSansSplits( drawerStateUpdater )}>
          <ListItemIcon>
            <SplitsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Splits</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setTransliteration( drawerStateUpdaterTrans )}>
          <ListItemIcon>
            <SwapIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Transliteration</ListItemText>
        </MenuItem>

      </MenuList>
    </Panel>
  )
}

export default SelectedTextContextMenu