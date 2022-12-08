import blockModel from '../model';

export interface Question {
  id: number;
  isResolved: boolean;
  text: string;
}

export const addQuestion = async (id: string, question: Question) => {
  await blockModel.updateOne(
    { id },
    { $push: { questionProperties: question } },
  );
};
