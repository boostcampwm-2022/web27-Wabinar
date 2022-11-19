import { createContext, Dispatch, SetStateAction } from 'react';
import { User } from 'src/types/user';

interface IUserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const UserContext = createContext<IUserContext | null>(null);

export default UserContext;
