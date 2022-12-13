/* eslint-disable no-useless-catch */
import CRDT from '@wabinar/crdt';
import LinkedList, {
  RemoteInsertOperation,
  RemoteDeleteOperation,
} from '@wabinar/crdt/linked-list';
import { useRef } from 'react';
import ERROR_MESSAGE from 'src/constants/error-message';
import { useUserContext } from 'src/hooks/useUserContext';

enum OPERATION_TYPE {
  INSERT,
  DELETE,
}

interface RemoteOperation {
  type: OPERATION_TYPE;
  op: RemoteDeleteOperation | RemoteInsertOperation;
}

export function useCRDT() {
  const { user } = useUserContext();

  if (!user) throw new Error(ERROR_MESSAGE.UNAUTHORIZED);

  const { id: clientId } = user;

  const crdtRef = useRef<CRDT>(new CRDT(clientId, new LinkedList()));

  const initializedRef = useRef<boolean>(false);
  let operationSet: RemoteOperation[] = [];

  const syncCRDT = (structure: unknown) => {
    crdtRef.current = new CRDT(
      clientId,
      new LinkedList(structure as LinkedList),
    );

    initializedRef.current = true;

    operationSet.forEach(({ type, op }) => {
      switch (type) {
        case OPERATION_TYPE.INSERT:
          remoteInsertCRDT(op as RemoteInsertOperation);
          break;
        case OPERATION_TYPE.DELETE:
          remoteDeleteCRDT(op as RemoteDeleteOperation);
          break;
        default:
          break;
      }
    });
    operationSet = [];
  };

  const readCRDT = (): string => {
    if (!initializedRef.current) return '';
    return crdtRef.current.read();
  };

  const spreadCRDT = (): string[] => {
    if (!initializedRef.current) return [];
    return crdtRef.current.spread();
  };

  const localInsertCRDT = (index: number, value: string) => {
    try {
      const remoteInsertion = crdtRef.current.localInsert(index, value);

      return remoteInsertion;
    } catch (e) {
      throw e;
    }
  };

  const localDeleteCRDT = (index: number) => {
    try {
      const targetIndex = crdtRef.current.localDelete(index);

      return targetIndex;
    } catch (e) {
      throw e;
    }
  };

  const remoteInsertCRDT = (op: RemoteInsertOperation) => {
    if (!initializedRef.current) {
      operationSet.push({ type: OPERATION_TYPE.INSERT, op });
      return null;
    }

    try {
      const prevIndex = crdtRef.current.remoteInsert(op);

      return prevIndex;
    } catch (e) {
      throw e;
    }
  };

  const remoteDeleteCRDT = (op: RemoteDeleteOperation) => {
    if (!initializedRef.current) {
      operationSet.push({ type: OPERATION_TYPE.DELETE, op });
      return null;
    }

    try {
      const targetIndex = crdtRef.current.remoteDelete(op);

      return targetIndex;
    } catch (e) {
      throw e;
    }
  };

  return {
    syncCRDT,
    readCRDT,
    spreadCRDT,
    localInsertCRDT,
    localDeleteCRDT,
    remoteInsertCRDT,
    remoteDeleteCRDT,
  };
}
