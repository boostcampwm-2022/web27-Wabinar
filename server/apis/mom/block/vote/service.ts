import { BlockType } from '@wabinar/constants/block';
import { Block } from '../model';
import { getBlock, putBlock, putVoteBlockStatus } from '../service';
export interface Option {
  id: number;
  text: string;
  count: number;
}

interface Options {
  [index: number]: Omit<Option, 'id'>;
}

export interface Vote {
  title: string;
  options: Options;
  isDoing: boolean;
  participants: { [index: number]: number };
}

export const createVote = async (blockId: string, options: Option[]) => {
  const processedOptions = options.reduce((obj, { id, text }) => {
    obj[id] = { text, count: 0 };
    return obj;
  }, {} as Options);

  await putBlock(blockId, BlockType.VOTE, {
    title: '투표',
    options: processedOptions,
    isDoing: true,
    participants: {},
  });
};

export const updateVote = async (
  blockId: string,
  optionIdString: string,
  userId: number,
) => {
  const voteBlock = await getBlock(blockId);

  const { voteProperties: vote } = voteBlock;

  if (!vote) return;

  const optionId = Number(optionIdString);
  const option = vote.options[optionId];

  if (!option) return;

  if (vote.participants[userId]) {
    const prevOptionId = vote.participants[userId];

    const prevOption = vote.options[prevOptionId];
    const { count } = prevOption;

    vote.options[prevOptionId] = { ...prevOption, count: count - 1 };
  }

  const { count } = option;

  vote.options[optionId] = { ...option, count: count + 1 };
  vote.participants[userId] = optionId;

  await putBlock(blockId, BlockType.VOTE, vote);

  const participantCount = Object.keys(vote.participants).length;

  return participantCount;
};

export const endVote = async (blockId: string) => {
  return await putVoteBlockStatus(blockId, false);
};

export const getVoteResult = async (block: Block) => {
  const { voteProperties: vote } = block;

  const participantCount = Object.keys(vote.participants).length;

  const options = Object.entries(vote.options).map(([id, rest]) => ({
    id,
    ...rest,
  }));

  const result = {
    options,
    participantCount,
  };

  return result;
};
