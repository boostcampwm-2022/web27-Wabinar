import momModel from './model';

// TODO: 예외처리
export const getMom = async (id: number) => {
  const mom = await momModel.findOne({ _id: id });
  return mom;
};

export const addMom = async () => {
  const mom = await momModel.insertMany([{ name: '', blocks: [] }]);
  return mom;
};
