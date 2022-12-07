interface Option {
  id: number;
  text: string;
  count: number;
}

export interface Vote {
  _id: string;
  title: string;
  options: Option[];
  isDoing: boolean;
}

interface Votes {
  [id: string]: Vote;
}

const votes: Votes = {};

export const createVote = (momId: number, vote: Vote) => {
  votes[momId] = { ...vote, isDoing: true };
  return votes[momId];
};

export const updateVote = (momId: number, optionId: number) => {
  const vote = votes[momId];
  if (!vote) return;

  const isExist = vote.options.some(({ id }) => optionId === id);
  if (!isExist) return;

  vote.options = vote.options.map((option) => {
    const { id, count } = option;

    if (id === optionId) {
      return { ...option, count: count + 1 };
    }
    return option;
  });

  return vote.options;
};

export const endVote = (momId: number) => {
  const vote = votes[momId];
  if (!vote) return { message: '존재하지 않는 투표입니다 ^^' };

  if (!votes[momId].isDoing) return { message: '이미 종료된 투표입니다 ^^' };

  votes[momId].isDoing = false;

  const participantNum = votes[momId].options.reduce(
    (acc, { count }) => acc + count,
    0,
  );

  return { vote, participantNum };
};
