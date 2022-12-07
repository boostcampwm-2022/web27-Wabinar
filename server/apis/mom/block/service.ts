import LinkedList from '@wabinar/crdt/linked-list';
import { BlockType } from '@wabinar/api-types/block';
import blockModel from './model';

export const getBlock = async (id: string) => {
  const block = await blockModel.findOne({ id });
  return block;
};

export const getBlockType = async (id: string) => {
  const block = await blockModel.findOne({ id });

  return block.type;
};

export const createBlock = async (id: string) => {
  const block = await blockModel.create({ id, type: BlockType.P });

  return block;
};

export const putBlockType = async (id: string, type: BlockType) => {
  await blockModel.updateOne({ id }, { type });
};

export const putBlock = async (
  id: string,
  type: BlockType,
  data: LinkedList,
) => {
  switch (type) {
    case BlockType.H1:
    case BlockType.H2:
    case BlockType.H3:
    case BlockType.P:
      await blockModel.updateOne(
        { id },
        { head: data.head, nodeMap: data.nodeMap },
      );
      break;
    case BlockType.VOTE:
      break;
    case BlockType.QUESTION:
      break;
    default:
      return;
  }
};

export const deleteBlock = async (id: string) => {
  await blockModel.deleteOne({ id });
};
