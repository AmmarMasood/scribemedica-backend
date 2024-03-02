"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const plans_1 = require("./config/plans");
const subscription_plan_schema_1 = require("./schemas/subscription-plan.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stripe_1 = require("./config/stripe");
const profile_schema_1 = require("../auth/schemas/profile.schema");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionPlanModel, profileModel, stripeService) {
        this.subscriptionPlanModel = subscriptionPlanModel;
        this.profileModel = profileModel;
        this.stripeService = stripeService;
        this.storeSubscriptionPlans = [
            {
                id: 'tier1-yearly',
                name: 'Tier 1 Yearly',
                description: '375 notes/month',
                stripePriceId: process.env.STRIPE_TIER_1_YEARLY_PRICE_ID,
                price: 1200,
            },
            {
                id: 'tier1-monthly',
                name: 'Tier 1 Monthly',
                description: '375 notes/month',
                stripePriceId: process.env.STRIPE_TIER_1_MONTHLY_ID,
                price: 120,
            },
            {
                id: 'tier2-yearly',
                name: 'Tier 2 Yearly',
                description: '100 notes/month',
                stripePriceId: process.env.STRIPE_TIER_2_YEARLY_PRICE_ID,
                price: 600,
            },
            {
                id: 'tier2-monthly',
                name: 'Tier 2 Monthly',
                description: '100 notes/month',
                stripePriceId: process.env.STRIPE_TIER_2_MONTHLY_ID,
                price: 60,
            },
        ];
    }
    async getAllPlans() {
        return this.storeSubscriptionPlans;
    }
    async initalizeFreeSubscription(userId) {
        const plan = await this.subscriptionPlanModel.create({
            userId,
            planId: plans_1.SubscriptionPlans.FREE,
            status: plans_1.SubscriptionPlanStatus.ACTIVE,
        });
        return plan;
    }
    async handleStripeWebhook(requestBody, signature) {
        var _a;
        let event;
        const stripe = this.stripeService.getStripe();
        try {
            event = stripe.webhooks.constructEvent(requestBody, signature, process.env.STRIPE_WEBHOOK_SECRECT_PROD);
            const session = event.data.object;
            console.log('============> WEBHOOK session', session);
            console.log('============> WEBHOOK event', event);
            if (event.type === 'customer.subscription.updated') {
                const subscription = event.data.object;
                if (subscription.canceled_at !== null) {
                    await this.subscriptionPlanModel.findOneAndUpdate({
                        stripeSubscriptionId: subscription.id,
                    }, {
                        status: plans_1.SubscriptionPlanStatus.CANCELLED,
                        planId: plans_1.SubscriptionPlans.FREE,
                        freePlanExpirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    });
                }
                else {
                    const subscription = await stripe.subscriptions.retrieve(session.subscription);
                    console.log('team here', subscription);
                    await this.subscriptionPlanModel.findOneAndUpdate({
                        stripeSubscriptionId: subscription.id,
                    }, {
                        status: plans_1.SubscriptionPlanStatus.ACTIVE,
                        stripeCustomerId: session.customer,
                        stripeSubscriptionId: session.subscription,
                        stripePriceId: subscription.items.data[0].price.id,
                        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        planId: session.metadata.planId,
                    });
                    await this.profileModel.findOneAndUpdate({
                        userId: session.metadata.userId,
                    }, {
                        notesAllowed: (0, plans_1.getNotesBasedOnPlan)(session.metadata.planId),
                    });
                }
            }
            if (!((_a = session === null || session === void 0 ? void 0 : session.metadata) === null || _a === void 0 ? void 0 : _a.userId)) {
                return {
                    status: 200,
                };
            }
            console.log('============> WEBHOOK  1 session', session);
            console.log('============> WEBHOOK 1 event', event);
            if (event.type === 'checkout.session.completed') {
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                await this.subscriptionPlanModel.findOneAndUpdate({
                    userId: session.metadata.userId,
                }, {
                    stripeCustomerId: session.customer,
                    stripeSubscriptionId: session.subscription,
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    planId: session.metadata.planId,
                });
                await this.profileModel.findOneAndUpdate({
                    userId: session.metadata.userId,
                }, {
                    notesAllowed: (0, plans_1.getNotesBasedOnPlan)(session.metadata.planId),
                });
            }
            if (event.type === 'invoice.payment_succeeded') {
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                await this.subscriptionPlanModel.findOneAndUpdate({
                    stripeSubscriptionId: subscription.id,
                }, {
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                });
            }
            if (event.type === 'subscription_schedule.canceled') {
                const canceledSubscription = event.data.object;
                await this.subscriptionPlanModel.findOneAndUpdate({
                    stripeSubscriptionId: canceledSubscription.id,
                }, {
                    status: plans_1.SubscriptionPlanStatus.CANCELLED,
                    planId: plans_1.SubscriptionPlans.FREE,
                    freePlanExpirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                });
            }
            if (event.type === 'customer.subscription.deleted') {
                const canceledSubscription = event.data.object;
                await this.subscriptionPlanModel.findOneAndUpdate({
                    stripeSubscriptionId: canceledSubscription.id,
                }, {
                    status: plans_1.SubscriptionPlanStatus.CANCELLED,
                    planId: plans_1.SubscriptionPlans.FREE,
                });
                await this.profileModel.findOneAndUpdate({
                    userId: session.metadata.userId,
                }, {
                    notesAllowed: (0, plans_1.getNotesBasedOnPlan)(plans_1.SubscriptionPlans.FREE),
                });
            }
            return {
                status: 'success',
                code: 200,
                message: 'Request succeeded',
            };
        }
        catch (err) {
            console.log('============> WEBHOOK ERROR', err);
            throw new common_1.BadRequestException(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`);
        }
    }
};
SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(subscription_plan_schema_1.SubscriptionPlan.name)),
    __param(1, (0, mongoose_1.InjectModel)(profile_schema_1.Profile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        stripe_1.StripeService])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map