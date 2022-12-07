import mongoose from '@db';
import { Schema } from 'mongoose';
import { Vote } from '../vote/service';
import { Question } from '../questions/service';

export type BlockType = 'h1' | 'h2' | 'h3' | 'p' | 'vote' | 'question';

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
  type: { type: String, required: true },
  head: { type: Object, default: null },
  nodeMap: { type: Object, default: {} },
  voteProperties: { type: Object, default: {} },
  questionProperties: { type: Object, default: {} },
});

const blockModel = mongoose.model('Block', blockSchema);

export default blockModel;
