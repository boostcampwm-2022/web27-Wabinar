import { createContext, Dispatch, SetStateAction } from 'react';
import { UserInfo } from 'src/types/user';

interface IUserContext {
  userInfo: UserInfo | null;
  setUserInfo: Dispatch<SetStateAction<UserInfo | null>>;
}

const UserContext = createContext<IUserContext | null>(null);

export default UserContext;
