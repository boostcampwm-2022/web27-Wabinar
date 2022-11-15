import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserContext from 'src/contexts/user';
import { LoginPage, OAuthPage, WorkspacePage } from 'src/pages';
import 'styles/reset.scss';

function App() {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/oauth" element={<OAuthPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
