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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPlanSchema = exports.SubscriptionPlan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const plans_1 = require("../config/plans");
let SubscriptionPlan = class SubscriptionPlan {
    get daysLeftForFreePlan() {
        const currentDate = new Date();
        const expirationDate = this.freePlanExpirationDate;
        if (currentDate < expirationDate) {
            const timeDiff = expirationDate.getTime() - currentDate.getTime();
            return Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
        }
        else {
            return 0;
        }
    }
    get isFreePlanActive() {
        return (this.planId === plans_1.SubscriptionPlans.FREE &&
            this.status === plans_1.SubscriptionPlanStatus.ACTIVE &&
            this.daysLeftForFreePlan > 0);
    }
};
__decorate([
    (0, mongoose_1.Prop)({ unique: true, required: [true, 'userId is required'] }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'status is required'],
        default: true,
        enum: Object.values(plans_1.SubscriptionPlanStatus),
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'planId is required'],
        type: String,
        enum: Object.values(plans_1.SubscriptionPlans),
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "freePlanExpirationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "stripeCustomerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "stripeSubscriptionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], SubscriptionPlan.prototype, "stripePriceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], SubscriptionPlan.prototype, "stripeCurrentPeriodEnd", void 0);
SubscriptionPlan = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], SubscriptionPlan);
exports.SubscriptionPlan = SubscriptionPlan;
exports.SubscriptionPlanSchema = mongoose_1.SchemaFactory.createForClass(SubscriptionPlan);
//# sourceMappingURL=subscription-plan.schema.js.map