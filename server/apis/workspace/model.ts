import { Schema } from "mongoose";
import mongoose from "@db";
import autoIncrement from "mongoose-auto-increment";

interface Workspace {
  id: number;
  name: string;
  code: string;
  users: number[];
  moms: number[];
}

const workspaceSchema = new Schema<Workspace>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  users: { type: [Number], default: [] },
  moms: { type: [Number], default: [] },
});
workspaceSchema.plugin(autoIncrement.plugin, {
  model: "workspace",
  field: "id",
  startAt: 1,
  increment: 1,
});

const workspaceModel = mongoose.model("Workspace", workspaceSchema);

export default workspaceModel;
