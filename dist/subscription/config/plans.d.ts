export interface SubscriptionPlan {
    id: string;
    name: string;
    description: string;
    stripePriceId: string;
    price: number;
}
export declare enum SubscriptionPlans {
    TIER1_YEARLY = "tier1-yearly",
    TIER1_MONTHLY = "tier1-monthly",
    TIER2_YEARLY = "tier2-yearly",
    TIER2_MONTHLY = "tier2-monthly",
    UNLIMITED_YEARLY = "unlimited-yearly",
    UNLIMITED_MONTHLY = "unlimited-monthly",
    FREE = "free"
}
export declare enum SubscriptionPlanStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    CANCELLED = "CANCELLED"
}
export declare const getNotesBasedOnPlan: (plan: SubscriptionPlans) => number;
export declare const isFreePlanActive: (subscriptionPlan: any) => boolean;
