import userModel from '@apis/user/model';
import workspaceModel from '@apis/workspace/model';

export const getWorksapces = async (id: number) => {
  const user = await userModel.findOne({ id });

  const workspaces = await workspaceModel.find({
    id: { $in: user.workspaces },
  });

  return workspaces;
};
