import Stripe from 'stripe';
export declare class StripeService {
    private readonly stripe;
    constructor();
    getStripe: () => Stripe;
}
