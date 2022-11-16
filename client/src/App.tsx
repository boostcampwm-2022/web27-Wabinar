import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getAuth } from 'src/apis/auth';
import UserContext, { User } from 'src/contexts/user';
import { LoadingPage, LoginPage, OAuthPage, WorkspacePage } from 'src/pages';
import 'styles/reset.scss';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const autoLogin = async () => {
    const currentUser = await getAuth();

    if (!currentUser) return;

    setUser(currentUser);
    navigate('/workspace');
  };

  useEffect(() => {
    autoLogin();
  }, []);

  return user ? (
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
