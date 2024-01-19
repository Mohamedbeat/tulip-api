import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(process.cwd());

    return 'Hello World!';
  }
}
