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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
export declare class SubscriptionPlan {
    userId: string;
    status: string;
    planId: string;
    freePlanExpirationDate: Date;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    stripeCurrentPeriodEnd: Date;
    get daysLeftForFreePlan(): number;
    get isFreePlanActive(): boolean;
}
export declare const SubscriptionPlanSchema: import("mongoose").Schema<SubscriptionPlan, import("mongoose").Model<SubscriptionPlan, any, any, any, import("mongoose").Document<unknown, any, SubscriptionPlan> & SubscriptionPlan & {
    _id: import("mongoose").Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SubscriptionPlan, import("mongoose").Document<unknown, {}, SubscriptionPlan> & SubscriptionPlan & {
    _id: import("mongoose").Types.ObjectId;
}>;
