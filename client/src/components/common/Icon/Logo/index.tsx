interface LogoIconProps {
  className?: string;
}

function LogoIcon({ className }: LogoIconProps) {
  return (
    <img
      className={className}
      src="https://user-images.githubusercontent.com/63364990/207813515-e5afe2a8-fac6-466d-8274-a69c4463873a.jpeg"
      alt="로고 아이콘"
    />
  );
}

export default LogoIcon;
