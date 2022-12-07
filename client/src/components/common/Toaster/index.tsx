import { ToastContainer } from 'react-toastify';

function Toaster() {
  return (
    <ToastContainer
      autoClose={2500}
      position="top-right"
      pauseOnHover={false}
    />
  );
}

export default Toaster;
