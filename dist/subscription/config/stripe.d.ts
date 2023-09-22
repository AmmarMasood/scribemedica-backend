import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private readonly configService;
    private readonly stripe;
    constructor(configService: ConfigService);
    getStripe: () => Stripe;
}
