import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getAuth } from 'src/apis/auth';
import UserContext from 'src/contexts/user';
import { LoginPage, OAuthPage, WorkspacePage } from 'src/pages';
import 'styles/reset.scss';

function App() {
  const [user, setUser] = useState(null);
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

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/oauth" element={<OAuthPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
