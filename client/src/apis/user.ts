import { baseRequest } from './util';

export const getWorkspaces = async (userId: number) => {
  try {
    const { data } = await baseRequest.get(`/user/${userId}/workspace`);

    return data;
  } catch (e) {
    console.log(e);
  }
};
