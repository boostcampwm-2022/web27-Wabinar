import { Comment } from 'react-loader-spinner';
import color from 'styles/color.module.scss';

interface LoaderProps {
  size: number;
}

function Loader({ size = 80 }: LoaderProps) {
  return (
    <Comment
      visible={true}
      height={size}
      width={size}
      ariaLabel="loader-spinner"
      wrapperClass="loader-wrapper"
      color={color.white}
      backgroundColor={color.highlight100}
    />
  );
}

export default Loader;
