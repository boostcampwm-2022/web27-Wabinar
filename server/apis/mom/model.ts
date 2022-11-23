import mongoose from '@db';
import { Schema } from 'mongoose';

interface Block {
  type: String;
  contents?: String;
}

interface Mom {
  name: string;
  blocks: Block[];
}

const momSchema = new Schema<Mom>({
  name: String,
  blocks: Array<Block>,
});

const momModel = mongoose.model('Mom', momSchema);

export default momModel;
