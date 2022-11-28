import mongoose from '@db';
import { Schema } from 'mongoose';
import LinkedList from '@wabinar/crdt/linked-list';

interface Block {
  type: String;
  contents?: String;
}

interface Mom {
  name: string;
  blocks: Block[];
  structure: LinkedList;
}

const momSchema = new Schema<Mom>({
  name: String,
  blocks: Array<Block>,
  structure: Object,
});

const momModel = mongoose.model('Mom', momSchema);

export default momModel;
