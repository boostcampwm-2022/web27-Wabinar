import { Schema } from "mongoose";
import mongoose from "@db";

interface User {
  id: number;
  name: string;
  created_at: Date;
  workspaces: number[];
}

const userSchema = new Schema<User>({
  id: Number,
  name: String,
  created_at: Date,
  workspaces: Array<Number>,
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
