import { SubscriptionService } from './subscription.service';
import { RequestWithRawBody } from 'src/middlewares/rawBody.middleware';
export declare class SubscriptionController {
    private readonly subscriptionService;
    constructor(subscriptionService: SubscriptionService);
    getAllPlans(): Promise<any>;
    stripeWebhook(stripeSignature: string, request: RequestWithRawBody): Promise<any>;
}
