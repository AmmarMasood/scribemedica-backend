import { BadRequestException, Injectable } from '@nestjs/common';
import type Stripe from 'stripe';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getHealth(): string {
    return 'Im healthy!';
  }
}
