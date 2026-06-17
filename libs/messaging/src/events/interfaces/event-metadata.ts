import { ICommandFactory } from "../event.factory";

export interface EventMetaData {
  name: string;
  commandFactory?: ICommandFactory<any>;
}
