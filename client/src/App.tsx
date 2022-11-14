import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "src/pages/Login";
import "style/reset.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
