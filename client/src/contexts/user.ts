import { createContext, Dispatch, SetStateAction } from 'react';

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface IUserContext {
  user?: User;
  setUser: Dispatch<SetStateAction<User>>;
}

const UserContext = createContext<IUserContext | null>(null);

export default UserContext;
