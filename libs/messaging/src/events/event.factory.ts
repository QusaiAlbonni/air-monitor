import { ICommand } from '@nestjs/cqrs';
import { Event, IEvent } from './interfaces/event';

export interface ICommandFactory<T extends IEvent> {
  createCommand(event: Event<T>): ICommand;
}
