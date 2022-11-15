import { baseRequest } from './util';

export const getWorkspacesAPI = async (userId: number) => {
  try {
    const { data } = await baseRequest.get(`/user/${userId}/workspace`);

    return data;
  } catch (e) {
    console.log(e);
  }
};
