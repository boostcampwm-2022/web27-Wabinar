import { BrowserRouter, Routes, Route } from "react-router-dom";

import { LoginPage, WorkspacePage } from "./pages";
import "style/reset.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
