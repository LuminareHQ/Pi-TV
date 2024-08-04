export type RemoteEvent = {
  payload: RemoteAction;
};

export type RemoteAction = {
  event: String;
  action: String;
  modifier: String | null;
};
