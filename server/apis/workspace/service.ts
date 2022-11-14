import { v4 as uuidv4 } from "uuid";
import workspaceModel from "./model";

export const create = async (name: string) => {
  const code = uuidv4();

  await workspaceModel.create({ name, code });

  return { name, code };
};
