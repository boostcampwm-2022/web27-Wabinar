import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import Toaster from './components/common/Toaster';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <HelmetProvider>
      <App />
      <Toaster />
    </HelmetProvider>
  </BrowserRouter>,
);
