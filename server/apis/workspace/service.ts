import { v4 as uuidv4 } from 'uuid';
import workspaceModel from './model';
import userModel, { User } from '@apis/user/model';
import momModel from '@apis/mom/model';
import AuthorizationError from '@errors/authorization-error';
import InvalidJoinError from '@errors/invalid-join-error';
import InvalidWorkspaceError from '@errors/invalid-workspace-error';

export const create = async (name: string) => {
  if (!name) throw new Error('워크스페이스 이름을 입력하세요 ^^');

  const code = uuidv4();

  const workspace = await workspaceModel.create({ name, code });

  return { name: workspace.name, code: workspace.code };
};

export const join = async (userId: number, code: string) => {
  if (!userId) throw new AuthorizationError('유저 인증 실패');

  if (!code) throw new InvalidJoinError('참여코드를 입력하세요 ^^');

  const workspace = await workspaceModel.findOne({ code });

  if (!workspace) throw new InvalidJoinError('잘못된 참여코드에요 ^^');

  const { id, name } = workspace;

  await workspaceModel.updateOne({ id }, { $push: { users: userId } });
  await userModel.updateOne({ id: userId }, { $push: { workspaces: id } });

  return { id, name, code };
};

export const info = async (workspaceId: number) => {
  if (!workspaceId) throw new InvalidJoinError('잘못된 접근이에요 ^^');

  const workspace = await workspaceModel.findOne({ id: workspaceId });

  if (!workspace)
    throw new InvalidWorkspaceError('존재하지 않는 워크스페이스에요 ^^');

  const { name, users, moms } = workspace;

  const usersInfo: Pick<User, 'name' | 'avatarUrl'>[] = [];
  const momsInfo: string[] = [];

  for await (const id of users) {
    const user = await userModel.findOne({ id });

    if (user) {
      const { name, avatarUrl } = user;
      usersInfo.push({ name, avatarUrl });
    }
  }

  for await (const id of moms) {
    const mom = await momModel.findOne({ id });

    if (mom) {
      const { name } = mom;
      momsInfo.push(name);
    }
  }

  return { workspaceName: name, usersInfo, momsInfo };
};
