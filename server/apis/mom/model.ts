import mongoose from '@db';
import { Schema } from 'mongoose';
import LinkedList from '@wabinar/crdt/linked-list';
import autoIncrement from 'mongoose-auto-increment';

export interface Mom extends LinkedList {
  id: number;
  title: string;
  createdAt: Date;
}

const momSchema = new Schema<Mom>(
  {
    id: { type: Number, required: true },
    title: { type: String, default: '제목 없음' },
    head: { type: Object, default: null },
    nodeMap: { type: Object, default: {} },
  },
  { timestamps: true },
);

momSchema.plugin(autoIncrement.plugin, {
  model: 'mom',
  field: 'id',
  startAt: 1,
  increment: 1,
});

const momModel = mongoose.model('Mom', momSchema);

export default momModel;
