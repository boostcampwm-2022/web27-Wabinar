const SOCKET_MESSAGE = {
  MOM: {
    START_MOM: 'start-mom',
    STOP_MOM: 'stop-mom',
    CREATE_MOM: 'create-mom',
    SELECT_MOM: 'select-mom',
    INIT_MOM: 'init-mom',
    INSERT_MOM: 'insert-mom',
    DELETE_MOM: 'delete-mom',
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
