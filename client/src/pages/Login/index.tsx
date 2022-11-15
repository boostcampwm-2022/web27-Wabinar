import BubblesIcon from "src/components/common/Icon/Bubbles";
import LogoIcon from "src/components/common/Icon/Logo";

import Button from "../../components/common/Button";
import GithubIcon from "../../components/common/Icon/Github";
import style from "./style.module.scss";

function LoginPage() {
  return (
    <div className={style.container}>
      <div className={style.icons}>
        <LogoIcon className={style.logo} />
        <BubblesIcon className={style.bubbles} />
      </div>

      <div className={style.copy}>
        <p>회의와 기록을 한번에</p>
        <p>원툴 웨비나</p>
      </div>

      <Button
        className={style["login-btn"]}
        text="로그인"
        icon={<GithubIcon size={30} />}
      />
    </div>
  );
}

export default LoginPage;
