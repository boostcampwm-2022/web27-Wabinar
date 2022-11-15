import userModel from '@apis/user/model';
import workspaceModel from '@apis/workspace/model';
import AuthorizationError from '@errors/authorization-error';

export const getWorksapces = async (targetUserId: string, userId: number) => {
  if (Number(targetUserId) !== userId)
    throw new AuthorizationError(
      '요청하신 유저 정보와 현재 로그인된 유저 정보가 다릅니다.',
    );

  const user = await userModel.findOne({ id: targetUserId });

  const workspaces = await workspaceModel.find({
    id: { $in: user.workspaces },
  });

  return workspaces;
};
