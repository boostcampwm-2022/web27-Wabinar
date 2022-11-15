import axios from 'axios';
import env from 'config';

const SERVER_PATH = env.SERVER_PATH;

export const baseRequest = axios.create({
  baseURL: SERVER_PATH,
  withCredentials: true,
});
