export interface IEvent {}
export interface Event<T extends IEvent> {
  id: string;
  data: T;
  type: string;
}
