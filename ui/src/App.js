import {
  Routes,
  Route
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
import useKeyPress from "./utils/useKeyPressHook"
import { useSetRecoilState } from "recoil"
import { transliterationState } from "./state/transliteration"
import { sanscriptDictState } from "./state/sanscriptDict"
import { sanscriptSplitsState } from "./state/sanscriptSplits"
// import GraphEditorPage from "./pages/GraphEditorPage"

function App() {

  const setTransliteration = useSetRecoilState( transliterationState )
  const setDictionary = useSetRecoilState( sanscriptDictState )
  const setSplits = useSetRecoilState( sanscriptSplitsState )

  const keyHandler = ( { eventKey } ) => {
    if ( eventKey === 'CTRL+t' ) {
      setTransliteration( s => ( { ...s, drawerOpened: !s.drawerOpened } ) )
      return true // handled
    }
    else if ( eventKey === 'CTRL+d' ) {
      setDictionary( s => ( { ...s, drawerOpened: !s.drawerOpened } ) )
      return true // handled
    }
    else if ( eventKey === 'CTRL+s' ) {
      setSplits( s => ( { ...s, drawerOpened: !s.drawerOpened } ) )
      return true // handled
    }
  }
  useKeyPress( [ 'CTRL+t', 'CTRL+d', 'CTRL+s' ], keyHandler )

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
    </>
  )
}

export default App
