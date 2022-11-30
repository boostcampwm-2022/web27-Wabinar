interface Option {
  id: number;
  option: string;
  count: number;
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
    const { id, count } = option;

    if (id === optionId) {
      return { ...option, count: count + 1 };
    }
    return option;
  });

  return vote.options;
};
