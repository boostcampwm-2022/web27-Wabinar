interface Option {
  id: number;
  option: string;
  votedNum: number;
}

interface Vote {
  _id: string;
  title: string;
  options: Option[];
}

interface Votes {
  [id: string]: Vote;
}

const votes: Votes = {};

export const createVote = (momId: number, vote: Vote) => {
  votes[momId] = vote;
  return votes[momId];
};

export const updateVote = (momId: number, optionId: number) => {
  const vote = votes[momId];
  if (!vote) return;

  const isExist = vote.options.some(({ id }) => optionId === id);
  if (!isExist) return;

  vote.options = vote.options.map((option) => {
    const { id, votedNum } = option;

    if (id === optionId) {
      return { ...option, votedNum: votedNum + 1 };
    }
    return option;
  });

  return vote.options;
};
