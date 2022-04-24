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
import SanscriptDictPage from "./pages/SanscriptDictPage"
// import GraphEditorPage from "./pages/GraphEditorPage"

function App() {
  return (
    <>
      <Routes>
        {/* All Simple Page Layout Routes goes under here */}
        <Route element={<SimplePageLayout />} >
          <Route path="/" >
            <Route index element={<HomePage />} />
            <Route path="entity" >
              <Route path="create" element={<EntityCRUDPage />} />
              <Route path=":id">
                <Route index element={<EntityGalaryPage />} />
                <Route path="edit" element={<EntityCRUDPage />} />
              </Route>
            </Route>
            <Route path="uploaders" >
              <Route path="sthotram" element={<SthotramUploadPage />} />
            </Route>
            <Route path="gods" element={<GodsPage />} />
            <Route path="transliterate" element={<TransliteratePage />} />
            <Route path="sans-dict" element={<SanscriptDictPage />} />
          </Route>
          {/* <Route path="editor" >
          <Route index element={<GraphEditorPage />} />
        </Route> */}
        </Route>
      </Routes>
      <TransliterationDrawer />
      <SanscriptDictDrawer />
    </>
  )
}

export default App
