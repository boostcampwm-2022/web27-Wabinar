import { io } from 'socket.io-client';
import env from 'src/config';

export default function useSocket(namespace: string) {
  // TODO: http://example.com/ 까지만 나타내는 환경변수로 SERVER_URL 사용.
  // SERVER_PATH 환경변수(http://example.com/api)와 겹치는 부분이 있으므로 리팩토링 필요
  // TODO: '/ws' 부분을 환경변수로 관리하기. 위 리팩토링 진행시 같이 진행 필요
  return io(`${env.SERVER_URL}${namespace}`, { path: '/ws' });
}
