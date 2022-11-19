import { Schema } from 'mongoose';
import mongoose from '@db';

export interface User {
  id: number;
  name: string;
  avatarUrl: string;
  createdAt: Date;
  workspaces: number[];
}

const userSchema = new Schema<User>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  workspaces: { type: [Number], default: [] },
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
