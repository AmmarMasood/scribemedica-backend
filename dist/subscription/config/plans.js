"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFreePlanActive = exports.getNotesBasedOnPlan = exports.SubscriptionPlanStatus = exports.SubscriptionPlans = void 0;
var SubscriptionPlans;
(function (SubscriptionPlans) {
    SubscriptionPlans["TIER1_YEARLY"] = "tier1-yearly";
    SubscriptionPlans["TIER1_MONTHLY"] = "tier1-monthly";
    SubscriptionPlans["TIER2_YEARLY"] = "tier2-yearly";
    SubscriptionPlans["TIER2_MONTHLY"] = "tier2-monthly";
    SubscriptionPlans["FREE"] = "free";
})(SubscriptionPlans = exports.SubscriptionPlans || (exports.SubscriptionPlans = {}));
var SubscriptionPlanStatus;
(function (SubscriptionPlanStatus) {
    SubscriptionPlanStatus["ACTIVE"] = "ACTIVE";
    SubscriptionPlanStatus["INACTIVE"] = "INACTIVE";
    SubscriptionPlanStatus["CANCELLED"] = "CANCELLED";
})(SubscriptionPlanStatus = exports.SubscriptionPlanStatus || (exports.SubscriptionPlanStatus = {}));
const getNotesBasedOnPlan = (plan) => {
    switch (plan) {
        case SubscriptionPlans.TIER1_YEARLY:
        case SubscriptionPlans.TIER1_MONTHLY:
            return 375;
        case SubscriptionPlans.TIER2_YEARLY:
        case SubscriptionPlans.TIER2_MONTHLY:
            return 100;
        case SubscriptionPlans.FREE:
            return 10;
        default:
            return 0;
    }
};
exports.getNotesBasedOnPlan = getNotesBasedOnPlan;
const daysLeftForFreePlan = (freePlanExpirationDate) => {
    const currentDate = new Date();
    const expirationDate = freePlanExpirationDate;
    if (currentDate < expirationDate) {
        const timeDiff = expirationDate.getTime() - currentDate.getTime();
        return Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    }
    else {
        return 0;
    }
};
const isFreePlanActive = (subscriptionPlan) => {
    return (subscriptionPlan.planId === SubscriptionPlans.FREE &&
        subscriptionPlan.status === SubscriptionPlanStatus.ACTIVE &&
        daysLeftForFreePlan(subscriptionPlan.freePlanExpirationDate) > 0);
};
exports.isFreePlanActive = isFreePlanActive;
//# sourceMappingURL=plans.js.map