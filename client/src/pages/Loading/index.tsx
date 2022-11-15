import cx from 'classnames';
import { Comment } from 'react-loader-spinner';
import color from 'styles/color.module.scss';

import style from './style.module.scss';

function LoadingPage() {
  return (
    <div className={cx(style.container)}>
      <Comment
        visible={true}
        height="100"
        width="100"
        ariaLabel="loader-spinner"
        wrapperClass="loader-wrapper"
        color={color.white}
        backgroundColor={color.highlight100}
      />
    </div>
  );
}

export default LoadingPage;
