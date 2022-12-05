import momModel from '@apis/mom/model';
import userModel, { User } from '@apis/user/model';
import AuthorizationError from '@errors/authorization-error';
import InvalidJoinError from '@errors/invalid-join-error';
import InvalidWorkspaceError from '@errors/invalid-workspace-error';
import { v4 as uuidv4 } from 'uuid';
import workspaceModel from './model';

export const create = async (name: string) => {
  if (!name) throw new Error('워크스페이스 이름을 입력하세요 ^^');

  const code = uuidv4();

  const { id } = await workspaceModel.create({ name, code });

  return { id, name, code };
};

export const join = async (userId: number, code: string) => {
  if (!userId) throw new AuthorizationError('유저 인증 실패');

  if (!code) throw new InvalidJoinError('참여코드를 입력하세요 ^^');

  const workspace = await workspaceModel.findOne({ code });

  if (!workspace) throw new InvalidJoinError('잘못된 참여코드에요 ^^');

  const { id, name } = workspace;

  const res = await workspaceModel.updateOne(
    { id },
    { $addToSet: { users: userId } },
  );

  if (!res.modifiedCount) {
    throw new InvalidJoinError('이미 참여한 워크스페이스에요 ^^');
  }

  await userModel.updateOne({ id: userId }, { $addToSet: { workspaces: id } });

  return { id, name, code };
};

export const info = async (workspaceId: number) => {
  if (!workspaceId) throw new InvalidWorkspaceError('잘못된 접근이에요 ^^');

  const workspace = await workspaceModel.findOne({ id: workspaceId });

  if (!workspace)
    throw new InvalidWorkspaceError('존재하지 않는 워크스페이스에요 ^^');

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
