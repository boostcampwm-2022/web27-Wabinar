import axios from 'axios';
import env from 'config';
import { toast } from 'react-toastify';

const SERVER_PATH = env.SERVER_PATH;

export const http = axios.create({
  baseURL: SERVER_PATH,
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 401:
          if (window.location.pathname !== '/') window.location.href = '/';
          toast('다시 로그인해주세요 .. ^^', { type: 'warning' });
          break;
        case 403:
          if (window.location.pathname !== '/') window.location.href = '/';
          toast('다시 로그인해주세요 .. ^^', { type: 'warning' });
          break;
        case 404:
          window.location.href = '/404';
          break;
        case 500:
          toast('500 Network Error .. ^^', { type: 'error' });
          break;
        default:
          return;
      }
    }
  },
);
