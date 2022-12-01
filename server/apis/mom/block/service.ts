import LinkedList from '@wabinar/crdt/linked-list';
import blockModel from './model';

export const getBlock = async (id: string) => {
  const block = await blockModel.findOne({ id });
  return block;
};

export const createBlock = async (id: string) => {
  const block = await blockModel.create({ id });

  return block;
};

export const putBlock = async (id: string, data: LinkedList) => {
  await blockModel.updateOne(
    { id },
    { head: data.head, nodeMap: data.nodeMap },
  );
};

export const deleteBlock = async (id: string) => {
  await blockModel.remove({ id });
};
