import mongoose from '@db';
import { Schema } from 'mongoose';
import LinkedList from '@wabinar/crdt/linked-list';

interface Mom extends LinkedList {
  name: string;
  createdAt: Date;
}

const momSchema = new Schema<Mom>({
  name: { type: String, default: '제목 없음' },
  createdAt: { type: Date, default: new Date() },
  head: { type: Object, default: null },
  nodeMap: { type: Object, default: {} },
});

const momModel = mongoose.model('Mom', momSchema);

export default momModel;
