import { Schema } from 'mongoose';
import mongoose from '@db';

interface Block {
  type: String;
  contents?: String;
}

interface Mom {
  id: number;
  name: string;
  blocks: Block[];
}

const momSchema = new Schema<Mom>({
  id: Number,
  name: String,
  blocks: Array<Block>,
});

const momModel = mongoose.model('Mom', momSchema);

export default momModel;
