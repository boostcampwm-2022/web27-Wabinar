import cx from 'classnames';
import Loader from 'components/common/Loader';

import style from './style.module.scss';

function LoadingPage() {
  return (
    <div className={cx(style.container)}>
      <Loader size={100} />
    </div>
  );
}

export default LoadingPage;
