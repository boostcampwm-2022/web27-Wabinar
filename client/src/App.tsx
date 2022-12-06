import { Suspense, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserContext from 'src/contexts/user';
import { LoginPage, OAuthPage, WorkspacePage } from 'src/pages';
import { User } from 'src/types/user';

import Loader from './components/common/Loader';
import NotFoundPage from './pages/404';

import 'styles/reset.scss';

function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Suspense fallback={<Loader size={100} />}>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/oauth" element={<OAuthPage />} />
          <Route path="/workspace/*" element={<WorkspacePage />} />
          <Route path="/404" element={<NotFoundPage />} />
        </Routes>
      </UserContext.Provider>
    </Suspense>
  );
}

export default App;
