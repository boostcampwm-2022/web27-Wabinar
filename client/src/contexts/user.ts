import { User } from '@wabinar/types/user';
import { createContext, Dispatch, SetStateAction } from 'react';

interface IUserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<IUserContext | null>(null);

export default UserContext;
