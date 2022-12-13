import { WORKSPACE_EVENT } from '@wabinar/constants/socket-message';
import { useEffect } from 'react';
import { useUserContext } from 'src/hooks/useUserContext';
import useUserStreamContext, { TConnectedUser } from 'src/hooks/useUserStreams';

import useMyMediaStreamContext from './useMyMediaStream';
import useSocketContext from './useSocketContext';

export default function useJoinMeeting() {
  const { workspaceSocket } = useSocketContext();
  const { user } = useUserContext();
  const { setConnectedUsers } = useUserStreamContext();
  const { setUserStreams } = useUserStreamContext();
  const { setMyMediaStream, myStreamRef } = useMyMediaStreamContext();

  useEffect(() => {
    workspaceSocket.emit(WORKSPACE_EVENT.SEND_HELLO, user?.id);

    const onExistingUsers = (users: TConnectedUser[]) => {
      const existingUsers = users.map((user) => ({
        ...user,
      }));

      setConnectedUsers(existingUsers);
    };

    const onExitUser = (sid: string) => {
      setUserStreams((prev) => {
        delete prev?.[sid];
        return prev;
      });

      setConnectedUsers((prev) => prev.filter((user) => user.sid !== sid));
    };

    workspaceSocket.on(WORKSPACE_EVENT.EXISTING_ROOM_USERS, onExistingUsers);
    workspaceSocket.on(WORKSPACE_EVENT.RECEIVE_BYE, onExitUser);

    return () => {
      workspaceSocket.off(WORKSPACE_EVENT.EXISTING_ROOM_USERS);
      workspaceSocket.off(WORKSPACE_EVENT.RECEIVE_BYE);

      setUserStreams(null);
      setConnectedUsers([]);
      setMyMediaStream(new MediaStream());
      myStreamRef.current = undefined;

      workspaceSocket.emit(WORKSPACE_EVENT.SEND_BYE);
    };
  }, []);
}
