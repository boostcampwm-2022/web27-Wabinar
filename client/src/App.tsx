import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'src/apis/auth';
import UserContext from 'src/contexts/user';
import { LoadingPage, LoginPage, OAuthPage, WorkspacePage } from 'src/pages';
import { UserInfo } from 'src/types/user';

import 'styles/reset.scss';

function App() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const autoLogin = async () => {
    const { user, workspaces } = await getAuth();

    setIsLoaded(true);

    if (!user) {
      if (location.pathname.match('/workspace')) navigate('/');
      return;
    }

    setUserInfo({ user, workspaces });

    let workspaceId = 0;
    if (workspaces) {
      workspaceId = workspaces[0].id;
    }

    navigate(`/workspace/${workspaceId}`);
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return isLoaded ? (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/oauth" element={<OAuthPage />} />
        <Route path="/workspace/:id" element={<WorkspacePage />} />
      </Routes>
    </UserContext.Provider>
  ) : (
    <LoadingPage />
  );
}

export default App;
