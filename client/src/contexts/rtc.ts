import {
  createContext,
  Dispatch,
  MutableRefObject,
  SetStateAction,
} from 'react';

export interface IMyMediaStreamContext {
  myStreamRef: MutableRefObject<MediaStream | undefined>;
  myMediaStream: MediaStream;
  setMyMediaStream: Dispatch<SetStateAction<MediaStream>>;
  isMyMicOn: boolean;
  setIsMyMicOn: Dispatch<SetStateAction<boolean>>;
  isMyCamOn: boolean;
  setIsMyCamOn: Dispatch<SetStateAction<boolean>>;
}

export type TUserStreams = {
  [key: string]: MediaStream | null;
};

export type TConnectedUser = {
  name: string;
  uid: number;
  sid: string;
  avatarUrl: string;
};

export interface IUserStreamContext {
  userStreams: TUserStreams | null;
  setUserStreams: Dispatch<SetStateAction<TUserStreams | null>>;
  connectedUsers: TConnectedUser[];
  setConnectedUsers: Dispatch<SetStateAction<TConnectedUser[]>>;
}

export const MyMediaStreamContext = createContext<IMyMediaStreamContext | null>(
  null,
);

export const UserStreamsContext = createContext<IUserStreamContext | null>(
  null,
);
