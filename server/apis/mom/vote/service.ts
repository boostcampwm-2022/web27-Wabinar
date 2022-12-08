export interface Option {
  id: number;
  text: string;
  count: number;
}

export interface Vote {
  _id: string;
  title: string;
  options: Map<number, Omit<Option, 'id'>>;
  isDoing: boolean;
  participants: Map<number, number>;
}

interface Votes {
  [id: string]: Vote;
}

const votes: Votes = {};

export const createVote = (momId: number, options: Option[]) => {
  const initOption = options.reduce((acc, { id, text }) => {
    acc.set(id, { text, count: 0 });
    return acc;
  }, new Map());

  votes[momId] = {
    _id: '', // TODO: DB 구축되면 _id 변경
    title: '투표',
    options: initOption,
    isDoing: true,
    participants: new Map(),
  };

  const createdOptions = [...votes[momId].options].map(([id, rest]) => ({
    id,
    ...rest,
  }));

  return createdOptions;
};

export const updateVote = (momId: number, optionId: number, userId: number) => {
  const vote = votes[momId];
  if (!vote) return;

  const option = vote.options.get(optionId);
  if (!option) return;

  const count = option.count;
  if (!vote.participants.get(userId)) {
    vote.options.set(optionId, { ...option, count: count + 1 });
  }

  vote.participants.set(userId, optionId);

  const participantCount = vote.participants.size;

  return participantCount;
};

export const endVote = (momId: number) => {
  const vote = votes[momId];
  if (!vote) return { message: '존재하지 않는 투표입니다 ^^' };

  if (!votes[momId].isDoing) return { message: '이미 종료된 투표입니다 ^^' };

  votes[momId].isDoing = false;

  const participantCount = vote.participants.size;

  const result = {
    options: [...vote.options].map(([id, rest]) => ({
      id,
      ...rest,
    })),
    participantCount,
  };

  return result;
};
