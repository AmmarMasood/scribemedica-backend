import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-08-16',
      typescript: true,
    });
  }

  // Add methods to interact with Stripe using this.stripe

  getStripe = (): Stripe => {
    return this.stripe;
  };
}
