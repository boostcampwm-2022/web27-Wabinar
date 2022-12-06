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
          console.debug(401);
          break;
        case 403:
          console.debug(403);
          break;
        case 404:
          console.debug(404);
          window.location.href = '/404';
          break;
        case 500:
          console.debug(500);
          toast('500 Network Error .. ^^', { type: 'error' });
          break;
        default:
          return;
      }
    }
  },
);
