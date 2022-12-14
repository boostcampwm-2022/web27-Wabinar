import userModel from '@apis/user/model';
import workspaceModel from '@apis/workspace/model';
import ERROR_MESSAGE from '@constants/error-message';
import ForbiddenError from '@errors/forbidden-error';

export const getWorkspaces = async (userId: number, targetUserId?: number) => {
  if (targetUserId !== userId) {
    throw new ForbiddenError(ERROR_MESSAGE.FORBIDDEN_WORKSPACES);
  }

  const user = await userModel.findOne({ id: userId });

  const workspaces = await workspaceModel.find(
    {
      id: { $in: user.workspaces },
    },
    { _id: 0, id: 1, name: 1, code: 1 },
  );

  return workspaces;
};
