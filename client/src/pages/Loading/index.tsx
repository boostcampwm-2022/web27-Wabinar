import cx from 'classnames';
import { Comment } from 'react-loader-spinner';

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
        color="#fff"
        backgroundColor="#59c3ff"
      />
    </div>
  );
}

export default LoadingPage;
