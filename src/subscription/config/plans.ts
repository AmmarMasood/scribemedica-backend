export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  price: number;
}

export enum SubscriptionPlans {
  TIER1_YEARLY = 'tier1-yearly',
  TIER1_MONTHLY = 'tier1-monthly',
  TIER2_YEARLY = 'tier2-yearly',
  TIER2_MONTHLY = 'tier2-monthly',
  FREE = 'free',
}

export enum SubscriptionPlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  CANCELLED = 'CANCELLED',
}

export const getNotesBasedOnPlan = (plan: SubscriptionPlans) => {
  switch (plan) {
    case SubscriptionPlans.TIER1_YEARLY:
    case SubscriptionPlans.TIER1_MONTHLY:
      return 375;
    case SubscriptionPlans.TIER2_YEARLY:
    case SubscriptionPlans.TIER2_MONTHLY:
      return 100;
    case SubscriptionPlans.FREE:
      return 5;
    default:
      return 0;
  }
};

// Virtual property to calculate the days left for the free plan
const daysLeftForFreePlan = (freePlanExpirationDate) => {
  const currentDate = new Date();
  const expirationDate = freePlanExpirationDate;
  if (currentDate < expirationDate) {
    const timeDiff = expirationDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (24 * 60 * 60 * 1000)); // Convert milliseconds to days and round up
  } else {
    return 0; // Free plan has expired
  }
};

// Virtual property to check if the free plan is active
export const isFreePlanActive = (subscriptionPlan: any) => {
  return (
    subscriptionPlan.planId === SubscriptionPlans.FREE &&
    subscriptionPlan.status === SubscriptionPlanStatus.ACTIVE &&
    daysLeftForFreePlan(subscriptionPlan.freePlanExpirationDate) > 0
  );
};
