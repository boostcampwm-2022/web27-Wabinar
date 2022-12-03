const SOCKET_MESSAGE = {
  MOM: {
    CREATE: 'create',
    SELECT: 'select',
    INIT: 'init-mom',
    INSERT_BLOCK: 'insert-block',
    DELETE_BLOCK: 'delete-block',
    UPDATED: 'updated-mom',
    CREATE_VOTE: 'create-vote',
    UPDATE_VOTE: 'update-vote',
    END_VOTE: 'end-vote',
  },
  BLOCK: {
    INIT: 'init-block',
    INSERT_TEXT: 'insert-text',
    DELETE_TEXT: 'delete-text',
  },
  WORKSPACE: {
    START_MEETING: 'start-mom',
    END_MEETING: 'end-mom',
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
