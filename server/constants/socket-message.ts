const SOCKET_MESSAGE = {
  MOM: {
    START: 'start',
    STOP: 'stop',
    CREATE: 'create',
    SELECT: 'select',
    INIT: 'init',
    INSERT: 'insert',
    DELETE: 'delete',
    CREATE_VOTE: 'create-vote',
    UPDATE_VOTE: 'update-vote',
    STOP_VOTE: 'stop-vote',
  },
  WORKSPACE: {
    SEND_HELLO: 'send-hello',
    RECEIVE_HELLO: 'receive-hello',
    SEND_OFFER: 'send-offer',
    RECEIVE_OFFER: 'receive-offer',
    SEND_ANSWER: 'send-answer',
    RECEIVE_ANSWER: 'receive-answer',
    SEND_ICE: 'send-ice',
    RECEIVE_ICE: 'receive-ice',
    RECEIVE_BYE: 'receive_bye',
  },
};

export default SOCKET_MESSAGE;
