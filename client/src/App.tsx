import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth } from 'src/apis/auth';
import UserContext from 'src/contexts/user';
import { LoadingPage } from 'src/pages';
import { UserInfo } from 'src/types/user';

import Timer from './components/Timer';

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

    const { id } = workspaces[0];
    navigate(`/workspace/${id}`);
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return isLoaded ? (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      <Timer />
      {/* <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/oauth" element={<OAuthPage />} />
        <Route path="/workspace/:id" element={<WorkspacePage />} />
      </Routes> */}
    </UserContext.Provider>
  ) : (
    <LoadingPage />
  );
}

export default App;
