import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'src/apis/auth';
import UserContext from 'src/contexts/user';
import { User } from 'src/types/user';

import 'styles/reset.scss';

const LoginPage = lazy(() => import('src/pages/Login'));
const OAuthPage = lazy(() => import('src/pages/OAuth'));
const WorkspacePage = lazy(() => import('src/pages/Workspace'));
const NotFoundPage = lazy(() => import('src/pages/404'));
const LoadingPage = lazy(() => import('src/pages/Loading'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const autoLogin = async () => {
    const { user } = await getAuth();

    setIsLoaded(true);
    setUser(user);

    if (user && !/^\/workspace(\/\d+(\/.+)?)?$/.test(pathname)) {
      navigate('/workspace');
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return (
    <Suspense fallback={<LoadingPage />}>
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
    </Suspense>
  );
}

export default App;
