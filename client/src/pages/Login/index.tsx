import Button from 'common/Button';
import BubblesIcon from 'common/Icon/Bubbles';
import GithubIcon from 'common/Icon/Github';
import LogoIcon from 'common/Icon/Logo';
import env from 'config';
import WabinarIcon from 'src/components/common/Icon/Wabinar';

import style from './style.module.scss';

function LoginPage() {
  const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_CLIENT_ID}`;

  return (
    <div className={style.container}>
      <div className={style.icons}>
        <LogoIcon className={style.logo} />
        <BubblesIcon className={style.bubbles} />
      </div>
      <div className={style.copy}>
        <WabinarIcon />
        <p>π» νμμ κΈ°λ‘μ νλ²μ π</p>
      </div>
      <Button
        className={style['login-btn']}
        text="λ‘κ·ΈμΈ"
        href={GITHUB_AUTH_URL}
        icon={<GithubIcon size={30} />}
      />
    </div>
  );
}

export default LoginPage;
