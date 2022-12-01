import workspaceModel from '@apis/workspace/model';
import { info } from '@apis/workspace/service';
import LinkedList from '@wabinar/crdt/linked-list';
import momModel from './model';

// TODO: 예외처리
export const getMom = async (id: string) => {
  const mom = await momModel.findOne({ _id: id });
  return mom;
};

export const createMom = async (workspaceId: string) => {
  const mom = await momModel.create({});

  await workspaceModel.updateOne(
    { id: workspaceId },
    { $addToSet: { moms: mom.id } },
  );

  return mom;
};

export const putMom = async (id: string, data: LinkedList) => {
  await momModel.updateOne(
    { _id: id },
    { head: data.head, nodeMap: data.nodeMap },
  );
};
