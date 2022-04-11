import {
  Routes,
  Route
} from "react-router-dom";

import HomePage from "./pages/HomePage"
import SimplePageLayout from "./pages/SimplePageLayout"
// import GraphEditorPage from "./pages/GraphEditorPage";

function App() {
  return (
    <Routes>
      {/* All Simple Page Layout Routes goes under here */}
      <Route element={<SimplePageLayout />} >
        <Route path="/" >
          <Route index element={<HomePage />} />
          {/* <Route path="arithmetic" >
            <Route path="new" element={<ArithmeticTestPage />} />
            <Route path="summary" element={<QASummaryPage />} />
            <Route index element={<SettingsPage />} />
          </Route> */}
        </Route>
        {/* <Route path="editor" >
          <Route index element={<GraphEditorPage />} />
        </Route> */}
      </Route>

    </Routes>
  );
}

export default App;
