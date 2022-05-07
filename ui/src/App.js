import {
  Routes,
  Route,
  useSearchParams
} from "react-router-dom"
import EntityGalaryPage from "./pages/EntityGalaryPage"
import GodsPage from "./pages/GodsPage"
import SthotramUploadPage from "./pages/SthotramUploadPage"

import HomePage from "./pages/HomePage"
import SimplePageLayout from "./pages/SimplePageLayout"
import EntityCRUDPage from "./pages/EntityCRUDPage"
import TransliteratePage from "./pages/TransliteratePage"
import TransliterationDrawer from "./components/TransliterationDrawer"
import SanscriptDictDrawer from "./components/SanscriptDictDrawer"
import SanscriptSplitsDrawer from "./components/SanscriptSplitsDrawer"
import SanscriptDictPage from "./pages/SanscriptDictPage"
import SanscriptSplitsPage from "./pages/SanscriptSplitsPage"
import useKeyPress, { C_KEY_CTRL, C_KEY_META, C_KEY_SHIFT } from "./utils/useKeyPressHook"
import { useSetRecoilState } from "recoil"
import { transliterationState } from "./state/transliteration"
import { sanscriptDictState } from "./state/sanscriptDict"
import { sanscriptSplitsState } from "./state/sanscriptSplits"
import { getSelectionText } from "./utils/utils"
import _ from "lodash"
import { C_LANGUAGE_DEFAULT, C_TRANSLATE_TEXT_MAP } from "./constants"
// import GraphEditorPage from "./pages/GraphEditorPage"
import useContextMenu from './utils/useContextMenu'
import SelectedTextContextMenu from './components/SelectedTextContextMenu'
import EntityDetailPage from "./pages/EntityDetailPage"
import EntityDetailDialog from "./components/EntityDetailDialog"

function App() {

  const [ searchParams ] = useSearchParams()
  const setTransliteration = useSetRecoilState( transliterationState )
  const setDictionary = useSetRecoilState( sanscriptDictState )
  const setSplits = useSetRecoilState( sanscriptSplitsState )
  const { anchorPoint, showContext, selectedText } = useContextMenu( { showOnlyOnTextSelection: true } );

  const drawerStateUpdater = s => ( {
    ...s, drawerOpened: !s.drawerOpened, inputText: getSelectionText() || s.inputText,
    inputScheme: _.find( C_TRANSLATE_TEXT_MAP, { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT } )?.value?.toUpperCase()
  } )
  const drawerStateUpdaterTrans = s => ( {
    ...s, drawerOpened: !s.drawerOpened, fromText: getSelectionText() || s.fromText,
    fromTextLang: _.find( C_TRANSLATE_TEXT_MAP, { language: searchParams.get( 'language' ) || C_LANGUAGE_DEFAULT } )?.value,
  } )

  const keyHandlerMap = {
    [ `${C_KEY_CTRL}+t` ]: () => {
      setTransliteration( drawerStateUpdaterTrans )
      return true // handled
    },
    [ `${C_KEY_CTRL}+d` ]: () => {
      setDictionary( drawerStateUpdater )
      return true // handled
    },
    [ `${C_KEY_CTRL}+s` ]: () => {
      setSplits( drawerStateUpdater )
      return true // handled
    },
  }
  const keyHandler = ( { eventKey } ) => {
    // console.log( eventKey )
    const fn = keyHandlerMap[ eventKey ]
    if ( fn ) return fn()
  }
  useKeyPress( Object.keys( keyHandlerMap ), keyHandler )
  // useKeyPress( [ `${C_KEY_CTRL}+t`, `${C_KEY_CTRL}+d`, `${C_KEY_CTRL}+s` ], keyHandler )

  return (
    <>
      <Routes>
        {/* All Simple Page Layout Routes goes under here */}
        <Route element={<SimplePageLayout />} >
          <Route path="/" >
            <Route index element={<HomePage />} />
            <Route path="entity" >
              {/* <Route path="create" element={<EntityCRUDPage />} /> */}
              <Route path="create">
                <Route index element={<EntityCRUDPage />} />
                <Route path=":parent" element={<EntityCRUDPage />} />
              </Route>
              <Route path=":id">
                <Route index element={<EntityGalaryPage />} />
                <Route path="edit" element={<EntityCRUDPage />} />
                <Route path="create" element={<EntityCRUDPage />} />
                <Route path="details" element={<EntityDetailPage />} />
              </Route>
            </Route>
            <Route path="uploaders" >
              <Route path="sthotram" element={<SthotramUploadPage />} />
            </Route>
            <Route path="gods" element={<GodsPage />} />

            <Route path="transliterate" element={<TransliteratePage />} />
            <Route path="sans-dict" element={<SanscriptDictPage />} />
            <Route path="sans-splits" element={<SanscriptSplitsPage />} />
          </Route>
          {/* <Route path="editor" >
          <Route index element={<GraphEditorPage />} />
        </Route> */}
        </Route>
      </Routes>
      <TransliterationDrawer />
      <SanscriptDictDrawer />
      <SanscriptSplitsDrawer />
      <EntityDetailDialog />
      {showContext && <SelectedTextContextMenu anchorPoint={anchorPoint} selectedText={selectedText} />}
    </>
  )
}

export default App
