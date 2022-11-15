import { createContext, Dispatch, SetStateAction } from 'react';

interface User {
  id: number;
  name: string;
  avatarUrl: string;
}

interface IUserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<null>>;
}

const UserContext = createContext<IUserContext | null>(null);

export default UserContext;
