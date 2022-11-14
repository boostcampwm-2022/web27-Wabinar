import mongoose, { Schema } from "mongoose";
import env from "../config";

const options = {
  maxPoolSize: 10,
};
mongoose.connect(
  `mongodb://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`,
  options
);

interface IWorkspace {
  id: number;
  name: string;
  users: number[];
  moms: number[];
}

const workspaceSchema = new Schema<IWorkspace>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  users: Array<Number>,
  moms: Array<Number>,
});

const workspaceModel = mongoose.model("Workspace", workspaceSchema);

interface IUser {
  id: number;
  name: string;
  created_at: Date;
  workspaces: number[];
}

const userSchema = new Schema<IUser>({
  id: Number,
  name: String,
  created_at: Date,
  workspaces: Array<Number>,
});

const userModel = mongoose.model("User", userSchema);

interface Block {
  type: String;
  contents?: String;
}

interface IMom {
  id: number;
  name: string;
  blocks: Block[];
}

const momSchema = new Schema<IMom>({
  id: Number,
  name: String,
  blocks: Array<Block>,
});

const momModel = mongoose.model("Mom", momSchema);

export default userModel;
