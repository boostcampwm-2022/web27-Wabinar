import userModel from '@apis/user/model';
import workspaceModel from '@apis/workspace/model';

export const getWorkspaces = async (userId: number, targetUserId?: number) => {
  /*
  if (targetUserId !== userId) {
    throw new AuthorizationError(
      '요청하신 유저 정보와 현재 로그인된 유저 정보가 달라요 ^^',
    );
  }
  */

  const user = await userModel.findOne({ id: userId });

  const workspaces = await workspaceModel.find(
    {
      id: { $in: user.workspaces },
    },
    { _id: 0, id: 1, name: 1 },
  );

  return workspaces;
};
