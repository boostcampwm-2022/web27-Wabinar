import { useEffect } from 'react';
import { toast } from 'react-toastify';
import WabIcon from 'src/components/common/Icon/Wab';

function NotFoundPage() {
  useEffect(() => {
    toast('404 Not Found .. ^^', {
      type: 'error',
    });
  }, []);

  return (
    <div>
      <h1>404 Page</h1>
      <WabIcon />
    </div>
  );
}

export default NotFoundPage;
