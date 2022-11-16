import { http } from './http';

export const getWorkspaces = async (userId: number) => {
  try {
    const { data } = await http.get(`/user/${userId}/workspace`);

    return data;
  } catch (e) {
    return;
  }
};
