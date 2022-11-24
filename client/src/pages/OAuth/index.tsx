import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postAuthLogin } from 'src/apis/auth';
import UserContext from 'src/contexts/user';
import LoadingPage from 'src/pages/Loading';

function OAuthPage() {
  const userContext = useContext(UserContext);

  if (userContext === null) {
    console.log('유저 컨텍스트를 찾을 수 없습니다.');

    return <LoadingPage />;
  }

  const location = useLocation();
  const navigate = useNavigate();

  const login = async (code: string) => {
    try {
      const authorizedUser = await postAuthLogin({ code });

      userContext.setUserInfo(authorizedUser);

      const id = authorizedUser.workspaces[0].id;
      navigate(`/workspace/${id}`);
    } catch (e) {
      navigate('/');
    }
  };

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const code = search.get('code');

    if (!code) {
      navigate('/');
      return;
    }

    login(code);
  }, []);

  return <LoadingPage />;
}

export default OAuthPage;
