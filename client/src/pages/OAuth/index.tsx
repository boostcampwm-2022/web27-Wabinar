import cx from 'classnames';
import Loader from 'components/common/Loader';
import { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { postAuthLogin } from 'src/apis/auth';
import UserContext from 'src/contexts/user';

import style from './style.module.scss';

function OAuthPage() {
  const { setUser } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();

  const login = async (code: string) => {
    try {
      const authorizedUser = await postAuthLogin(code);

      setUser(authorizedUser);
      navigate('/workspace');
    } catch (e) {
      navigate('/');
    }
  };

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const code = search.get('code');

    if (!code) navigate('/');

    login(code!);
  }, []);

  return (
    <div className={cx(style.container)}>
      <Loader size={100} />
    </div>
  );
}

export default OAuthPage;
