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
const config_1 = require("@nestjs/config");
let SubscriptionService = class SubscriptionService {
    constructor(subscriptionPlanModel, profileModel, configService, stripeService) {
        this.subscriptionPlanModel = subscriptionPlanModel;
        this.profileModel = profileModel;
        this.configService = configService;
        this.stripeService = stripeService;
        this.storeSubscriptionPlans = [
            {
                id: 'tier1-yearly',
                name: 'Tier 1 Yearly',
                description: '375 notes/month',
                stripePriceId: this.configService.get('STRIPE_TIER_1_YEARLY_PRICE_ID'),
                price: 1200,
            },
            {
                id: 'tier1-monthly',
                name: 'Tier 1 Monthly',
                description: '375 notes/month',
                stripePriceId: this.configService.get('STRIPE_TIER_1_MONTHLY_ID'),
                price: 120,
            },
            {
                id: 'tier2-yearly',
                name: 'Tier 2 Yearly',
                description: '100 notes/month',
                stripePriceId: this.configService.get('STRIPE_TIER_2_YEARLY_PRICE_ID'),
                price: 600,
            },
            {
                id: 'tier2-monthly',
                name: 'Tier 2 Monthly',
                description: '100 notes/month',
                stripePriceId: this.configService.get('STRIPE_TIER_2_MONTHLY_ID'),
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
            event = stripe.webhooks.constructEvent(requestBody, signature, this.configService.get('STRIPE_WEBHOOK_SECRECT_PROD'));
            const session = event.data.object;
            if (!((_a = session === null || session === void 0 ? void 0 : session.metadata) === null || _a === void 0 ? void 0 : _a.userId)) {
                return {
                    status: 200,
                };
            }
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
            console.log('============> ', event);
            return {
                status: 'success',
                code: 200,
                message: 'Request succeeded',
            };
        }
        catch (err) {
            console.log('============> ', err);
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
        config_1.ConfigService,
        stripe_1.StripeService])
], SubscriptionService);
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=subscription.service.js.map