/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { SubscriptionPlan } from './schemas/subscription-plan.schema';
import { Model } from 'mongoose';
import { StripeService } from './config/stripe';
import { Profile } from 'src/auth/schemas/profile.schema';
import { ConfigService } from '@nestjs/config';
export declare class SubscriptionService {
    private subscriptionPlanModel;
    private profileModel;
    private readonly configService;
    private readonly stripeService;
    private storeSubscriptionPlans;
    constructor(subscriptionPlanModel: Model<SubscriptionPlan>, profileModel: Model<Profile>, configService: ConfigService, stripeService: StripeService);
    getAllPlans(): Promise<any>;
    initalizeFreeSubscription(userId: string): Promise<import("mongoose").Document<unknown, {}, SubscriptionPlan> & SubscriptionPlan & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    handleStripeWebhook(requestBody: any, signature: any): Promise<any>;
}
