import Button from "../components/shared/Button";
import GithubIcon from "../components/shared/Icon/Github";

function Login() {
  return (
    <div>
      <Button text="로그인" icon={<GithubIcon />} />
    </div>
  );
}

export default Login;
