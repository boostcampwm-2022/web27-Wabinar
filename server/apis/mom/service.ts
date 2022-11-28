import LinkedList from '@wabinar/crdt/linked-list';
import momModel from './model';

// TODO: 예외처리
export const getMom = async (id: string) => {
  const mom = await momModel.findOne({ _id: id });
  return mom;
};

export const createMom = async () => {
  const mom = await momModel.create({ name: '', blocks: [] });
  return mom;
};

export const putMom = async (id: string, structure: LinkedList) => {
  await momModel.updateOne({ _id: id }, { structure });
};
