import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-08-16',
      typescript: true,
    });
  }

  // Add methods to interact with Stripe using this.stripe

  getStripe = (): Stripe => {
    return this.stripe;
  };
}
