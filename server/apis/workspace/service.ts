import { v4 as uuidv4 } from "uuid";
import workspaceModel from "./model";
import userModel from "@apis/user/model";

export const create = async (name: string) => {
  const code = uuidv4();

  const workspace = await workspaceModel.create({ name, code });

  return { name: workspace.name, code: workspace.code };
};

export const join = async (userId: number, code: string) => {
  const workspace = await workspaceModel.findOne({ code });

  const { id, name } = workspace;

  await workspaceModel.updateOne({ id }, { $push: { users: userId } });
  await userModel.updateOne({ id: userId }, { $push: { workspaces: id } });

  return { id, name, code };
};
