import { Injectable } from '@nestjs/common';
import { BadRequestException } from './app.exceptions';

@Injectable()
export class AppService {
  async create(): Promise<void> {
    throw new BadRequestException({ error: 'Not implemented' });
  }

  async update(): Promise<void> {
    throw new BadRequestException({ error: 'Not implemented' });
  }
}
