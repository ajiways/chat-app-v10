export enum EEvent {
  MESSAGE = 'message',
  JOIN_ROOM = 'room:join',
  ROOM_LEAVE = 'room:leave',
  CONNECTION = 'connection',
}

export enum ESendEvent {
  NEW_MESSAGE = 'message:new',
  TRY_RECONNECT = 'reconnect:try',
  NEW_MESSAGE_ERROR = 'message:new:error',
  NEW_USER = 'user:join',
  CONNECTION_SUCCEED = 'connection:ok',
  ROOM_ENTRY_SUCCEED = 'room:join:ok',
}
