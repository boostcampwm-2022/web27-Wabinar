import { Schema } from "mongoose";
import mongoose from "@db";

interface Workspace {
  id: number;
  name: string;
  users: number[];
  moms: number[];
}

const workspaceSchema = new Schema<Workspace>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  users: Array<Number>,
  moms: Array<Number>,
});

const workspaceModel = mongoose.model("Workspace", workspaceSchema);

export default workspaceModel;
