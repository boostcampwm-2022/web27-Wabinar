import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'src/apis/auth';
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
import MetaHelmet from './components/MetaHelmet';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();

  const autoLogin = async () => {
    const { user } = await getAuth();

    setIsLoaded(true);

    setUser(user);

    if (user && !/^\/workspace(\/\d)?$/.test(location.pathname)) {
      navigate('/workspace');
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <>
      <MetaHelmet title="화상회의와 회의록 작성을 한번에, Wabinar" />
      {isLoaded ? (
        <UserContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/oauth" element={<OAuthPage />} />
            <Route path="/workspace/*" element={<WorkspacePage />} />
            <Route path="/404" element={<NotFoundPage />} />
          </Routes>
        </UserContext.Provider>
      ) : (
        <LoadingPage />
      )}
    </>
  );
}

export default App;
