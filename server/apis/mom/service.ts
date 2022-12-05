import workspaceModel from '@apis/workspace/model';
import { Identifier, Node } from '@wabinar/crdt/node';
import LinkedList from '@wabinar/crdt/linked-list';
import momModel from './model';
import { v4 as uuid } from 'uuid';
import { createBlock } from './block/service';

// TODO: 예외처리
export const getMom = async (id: string) => {
  const mom = await momModel.findOne({ _id: id });
  return mom;
};

export const createMom = async (workspaceId: string) => {
  const blockId = uuid();
  await createBlock(blockId);

  const nodeId = new Identifier(1, -1);
  const momNode = new Node(blockId, nodeId);
  const defaultNodeMap = { [JSON.stringify(nodeId)]: momNode };

  const mom = await momModel.create({
    head: nodeId,
    nodeMap: defaultNodeMap,
  });

  await workspaceModel.updateOne(
    { id: workspaceId },
    { $addToSet: { moms: mom.id } },
  );

  return mom;
};

export const putMomTitle = async (id: string, title: string) => {
  await momModel.updateOne({ _id: id }, { title });
};

export const putMom = async (id: string, data: LinkedList) => {
  await momModel.updateOne(
    { _id: id },
    { head: data.head, nodeMap: data.nodeMap },
  );
};
