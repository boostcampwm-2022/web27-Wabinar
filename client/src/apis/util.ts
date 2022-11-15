import axios from 'axios';

const SERVER_URL = 'http://localhost:8080';

export const baseRequest = axios.create({
  baseURL: SERVER_URL,
});
