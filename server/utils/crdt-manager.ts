import {
  createBlock,
  deleteBlock,
  getBlock,
  putBlock,
} from '@apis/mom/block/service';
import { Mom } from '@apis/mom/model';
import { createMom, getMom, putMom } from '@apis/mom/service';
import CRDT from '@wabinar/crdt';
import LinkedList, {
  RemoteDeleteOperation,
  RemoteInsertOperation,
} from '@wabinar/crdt/linked-list';

export default class CrdtManager {
  momMap;
  blockMap;

  constructor() {
    this.momMap = new Map<string, CRDT>();
    this.blockMap = new Map<string, CRDT>();
  }

  async onCreateMom(workspaceId: string) {
    const mom = await createMom(workspaceId);

    await this.initMapEntry(mom._id.toString(), mom);

    return mom;
  }

  async onSelectMom(momId: string) {
    const mom = await getMom(momId);

    if (!this.momMap.has(momId)) {
      await this.initMapEntry(momId, mom);
    }

    return mom;
  }

  async getMomCRDT(momId: string) {
    return this.momMap.get(momId);
  }

  async onInsertBlock(
    momId: string,
    blockId: string,
    remoteInsertion: RemoteInsertOperation,
  ) {
    const { head, nodeMap } = await createBlock(blockId);

    const blockCrdt = new CRDT(-1, { head, nodeMap } as LinkedList);
    this.blockMap.set(blockId, blockCrdt);

    const momCrdt = this.momMap.get(momId);
    momCrdt.remoteInsert(remoteInsertion);

    putMom(momId, momCrdt.plainData);
  }

  async onDeleteBlock(
    momId: string,
    blockId: string,
    remoteDeletion: RemoteDeleteOperation,
  ) {
    const momCrdt = this.momMap.get(momId);
    momCrdt.remoteDelete(remoteDeletion);

    putMom(momId, momCrdt.plainData);

    this.blockMap.delete(blockId);
    deleteBlock(blockId);
  }

  async getBlockCRDT(blockId: string) {
    return this.blockMap.get(blockId);
  }

  async onInsertText(blockId: string, remoteInsertion: RemoteInsertOperation) {
    const crdt = this.blockMap.get(blockId);
    crdt.remoteInsert(remoteInsertion);

    putBlock(blockId, crdt.plainData);
  }

  async onDeleteText(blockId: string, remoteDeletion: RemoteDeleteOperation) {
    const crdt = this.blockMap.get(blockId);
    crdt.remoteDelete(remoteDeletion);

    putBlock(blockId, crdt.plainData);
  }

  private async initMapEntry(momId: string, mom: Mom) {
    const { head, nodeMap } = mom;

    const momCRDT = new CRDT(-1, { head, nodeMap } as LinkedList);

    this.momMap.set(momId, momCRDT);

    const blockIds = momCRDT.spread();

    const blockMapInsertions = blockIds.map((id) => {
      return new Promise<void>(async (resolve) => {
        const { head, nodeMap } = await getBlock(id);

        const blockCRDT = new CRDT(-1, { head, nodeMap } as LinkedList);

        this.blockMap.set(id, blockCRDT);
        resolve();
      });
    });

    await Promise.all(blockMapInsertions);
  }
}
