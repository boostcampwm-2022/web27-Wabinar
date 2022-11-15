import { v4 as uuidv4 } from 'uuid';
import workspaceModel from './model';
import userModel from '@apis/user/model';
import AuthorizationError from '@errors/authorization-error';
import InvalidJoinError from '@errors/invalid-join-error';

export const create = async (name: string) => {
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
