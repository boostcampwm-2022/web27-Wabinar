import { Suspense, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import UserContext from 'src/contexts/user';
import {
  LoadingPage,
  LoginPage,
  NotFoundPage,
  OAuthPage,
  WorkspacePage,
} from 'src/pages';
import { User } from 'src/types/user';

import 'styles/reset.scss';

function App(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Suspense fallback={<LoadingPage />}>
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
