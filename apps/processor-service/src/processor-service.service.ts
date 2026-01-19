import { Injectable } from '@nestjs/common';

@Injectable()
export class ProcessorServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
