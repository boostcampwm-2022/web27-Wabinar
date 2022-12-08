import momModel from '@apis/mom/model';
import userModel, { User } from '@apis/user/model';
import ERROR_MESSAGE from '@constants/error-message';
import AuthorizationError from '@errors/authorization-error';
import InvalidJoinError from '@errors/invalid-join-error';
import InvalidWorkspaceError from '@errors/invalid-workspace-error';
import { v4 as uuidv4 } from 'uuid';
import workspaceModel from './model';

export const create = async (name: string) => {
  if (!name) throw new Error(ERROR_MESSAGE.EMPTY_WORKSPACE_NAME);

  const code = uuidv4();

  const { id } = await workspaceModel.create({ name, code });

  return { id, name, code };
};

export const join = async (userId: number, code: string) => {
  if (!userId) throw new AuthorizationError(ERROR_MESSAGE.UNAUTHORIZED);

  if (!code) throw new InvalidJoinError(ERROR_MESSAGE.EMPTY_WORKSPACE_CODE);

  const workspace = await workspaceModel.findOne({ code });

  if (!workspace)
    throw new InvalidJoinError(ERROR_MESSAGE.INVALID_WORKSPCAE_CODE);

  const { id, name } = workspace;

  const res = await workspaceModel.updateOne(
    { id },
    { $addToSet: { users: userId } },
  );

  if (!res.modifiedCount) {
    throw new InvalidJoinError(ERROR_MESSAGE.ALREADY_JOINED_WORKSPACE);
  }

  await userModel.updateOne({ id: userId }, { $addToSet: { workspaces: id } });

  return { id, name, code };
};

export const info = async (workspaceId: number) => {
  if (!workspaceId) throw new InvalidWorkspaceError(ERROR_MESSAGE.BAD_REQUEST);

  const workspace = await workspaceModel.findOne({ id: workspaceId });

  if (!workspace)
    throw new InvalidWorkspaceError(ERROR_MESSAGE.INVALID_WORKSPACE);

  const { name, users: userIds, moms: momsIds } = workspace;

  const members: Pick<User, 'id' | 'name' | 'avatarUrl'>[] =
    (await userModel.find(
      {
        id: { $in: userIds },
      },
      { id: 1, name: 1, avatarUrl: 1, _id: 0 },
    )) || [];

  const moms: string[] = momsIds.length
    ? await momModel.find({ id: { $in: momsIds } }, { title: 1 })
    : [];

  return { name, members, moms };
};
