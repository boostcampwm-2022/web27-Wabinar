import CRDT, {
  RemoteInsertOperation,
  RemoteDeleteOperation,
} from '@wabinar/crdt';
import { useRef } from 'react';
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
  const crdtRef = useRef<CRDT>(new CRDT());
  const userContext = useUserContext();

  let initialized = false;
  const operationSet: RemoteOperation[] = [];

  const syncCRDT = (object: unknown) => {
    Object.setPrototypeOf(object, CRDT.prototype);

    crdtRef.current = object as CRDT;
    crdtRef.current.setClientId(userContext.userInfo?.user.id);

    initialized = true;
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
  };

  const readCRDT = (): string => {
    if (!initialized) return '';
    return crdtRef.current.read();
  };

  const localInsertCRDT = (index: number, letter: string) => {
    const remoteInsertion = crdtRef.current.localInsert(index, letter);

    return remoteInsertion;
  };

  const localDeleteCRDT = (index: number) => {
    const targetIndex = crdtRef.current.localDelete(index);

    return targetIndex;
  };

  const remoteInsertCRDT = (op: RemoteInsertOperation) => {
    if (!initialized) {
      operationSet.push({ type: OPERATION_TYPE.INSERT, op });
      return null;
    }

    const prevIndex = crdtRef.current.remoteInsert(op);

    return prevIndex;
  };

  const remoteDeleteCRDT = (op: RemoteDeleteOperation) => {
    if (!initialized) {
      operationSet.push({ type: OPERATION_TYPE.DELETE, op });
      return null;
    }

    const targetIndex = crdtRef.current.remoteDelete(op);

    return targetIndex;
  };

  return {
    syncCRDT,
    readCRDT,
    localInsertCRDT,
    localDeleteCRDT,
    remoteInsertCRDT,
    remoteDeleteCRDT,
  };
}
