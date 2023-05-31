import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import 'react-toastify/dist/ReactToastify.css';

import App from './App';
import Toaster from './components/common/Toaster';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RecoilRoot>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </RecoilRoot>,
);
