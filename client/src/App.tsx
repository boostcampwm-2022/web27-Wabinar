import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'src/apis/auth';
import UserContext from 'src/contexts/user';
import { LoadingPage, LoginPage, OAuthPage, WorkspacePage } from 'src/pages';
import { User } from 'src/types/user';
import 'styles/reset.scss';

function App() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const autoLogin = async () => {
    const currentUser = await getAuth();

    setIsLoaded(true);

    if (!currentUser) {
      if (location.pathname !== '/') navigate('/');
      return;
    }

    setUser(currentUser);
    navigate('/workspace');
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return isLoaded ? (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/oauth" element={<OAuthPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
    </UserContext.Provider>
  ) : (
    <LoadingPage />
  );
}

export default App;
