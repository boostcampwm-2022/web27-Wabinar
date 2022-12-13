import LinkedList from '@wabinar/crdt/linked-list';
import { BlockType } from '@wabinar/constants/block';
import blockModel from './model';
import { Question } from './question/service';
import { Vote } from './vote/service';

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
  data: LinkedList | Question[] | Vote,
) => {
  switch (type) {
    case BlockType.H1:
    case BlockType.H2:
    case BlockType.H3:
    case BlockType.P:
      await putTextBlock(id, data as LinkedList);
      break;
    case BlockType.VOTE:
      await putVoteBlock(id, data as Vote);
      break;
    case BlockType.QUESTION:
      await putQuestionBlock(id, data as Question[]);
      break;
    default:
      throw new Error(`Bad type ${type} received`);
  }
};

const putTextBlock = async (id: string, data: LinkedList) => {
  await blockModel.updateOne(
    { id },
    { head: (data as LinkedList).head, nodeMap: data.nodeMap },
  );
};

const putVoteBlock = async (id: string, vote: Vote) => {
  await blockModel.updateOne({ id }, { voteProperties: vote });
};

export const putVoteBlockStatus = async (id: string, isDoing: boolean) => {
  const block = await blockModel.findOneAndUpdate(
    { id },
    { $set: { 'voteProperties.isDoing': isDoing } },
    { new: true },
  );

  return block;
};

const putQuestionBlock = async (id: string, questions: Question[]) => {
  await blockModel.updateOne({ id }, { questionProperties: questions });
};

export const deleteBlock = async (id: string) => {
  await blockModel.deleteOne({ id });
};
