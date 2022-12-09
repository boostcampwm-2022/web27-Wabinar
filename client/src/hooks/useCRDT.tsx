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
  const operationSet: RemoteOperation[] = [];

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
    const remoteInsertion = crdtRef.current.localInsert(index, value);

    return remoteInsertion;
  };

  const localDeleteCRDT = (index: number) => {
    const targetIndex = crdtRef.current.localDelete(index);

    return targetIndex;
  };

  const remoteInsertCRDT = (op: RemoteInsertOperation) => {
    if (!initializedRef.current) {
      operationSet.push({ type: OPERATION_TYPE.INSERT, op });
      return null;
    }

    const prevIndex = crdtRef.current.remoteInsert(op);

    return prevIndex;
  };

  const remoteDeleteCRDT = (op: RemoteDeleteOperation) => {
    if (!initializedRef.current) {
      operationSet.push({ type: OPERATION_TYPE.DELETE, op });
      return null;
    }

    const targetIndex = crdtRef.current.remoteDelete(op);

    return targetIndex;
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
