import mongoose from '@db';
import { Schema } from 'mongoose';
import { BlockType } from '@wabinar/api-types/block';

import { Vote } from '../vote/service';
import { Question } from '../questions/service';

interface Block {
  id: string;
  type: BlockType;
  head: Object;
  nodeMap: Object;
  voteProperties: Vote;
  questionProperties: Question;
}

const blockSchema = new Schema<Block>({
  id: { type: String, required: true },
  type: { type: Number, required: true },
  head: { type: Object, default: null },
  nodeMap: { type: Object, default: {} },
  voteProperties: { type: Object, default: {} },
  questionProperties: { type: Object, default: {} },
});

const blockModel = mongoose.model('Block', blockSchema);

export default blockModel;
