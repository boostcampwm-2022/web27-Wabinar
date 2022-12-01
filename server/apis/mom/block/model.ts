import mongoose from '@db';
import { Schema } from 'mongoose';
import LinkedList from '@wabinar/crdt/linked-list';

interface Block extends LinkedList {
  id: string;
}

const blockSchema = new Schema<Block>({
  id: { type: String, required: true },
  head: { type: Object, default: null },
  nodeMap: { type: Object, default: {} },
});

const blockModel = mongoose.model('Block', blockSchema);

export default blockModel;
