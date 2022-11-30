interface Option {
  id: number;
  text: string;
  votedNum: number;
}

interface Vote {
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

  const option = vote.options.filter(({ id }) => optionId === id);
  if (!option.length) return;

  vote.options = vote.options.map((option) => {
    const { id, votedNum } = option;

    if (id === optionId) {
      return { ...option, votedNum: votedNum + 1 };
    }
    return option;
  });

  return vote.options;
};

export const stopVote = (momId: number) => {
  const vote = votes[momId];
  if (!vote) return { message: '존재하지 않는 투표입니다 ^^' };

  if (!votes[momId].isDoing) return { message: '이미 종료된 투표입니다 ^^' };

  votes[momId].isDoing = false;

  const participantNum = votes[momId].options.reduce(
    (acc, { votedNum }) => acc + votedNum,
    0,
  );

  return { vote, participantNum };
};
