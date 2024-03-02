"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const mongoose_1 = require("@nestjs/mongoose");
const profile_schema_1 = require("./schemas/profile.schema");
const subscription_service_1 = require("../subscription/subscription.service");
const subscription_module_1 = require("../subscription/subscription.module");
const subscription_plan_schema_1 = require("../subscription/schemas/subscription-plan.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
const stripe_1 = require("../subscription/config/stripe");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Profile',
                    schema: profile_schema_1.ProfileSchema,
                },
                {
                    name: 'SubscriptionPlan',
                    schema: subscription_plan_schema_1.SubscriptionPlanSchema,
                },
                {
                    name: 'Note',
                    schema: note_schema_1.NoteSchema,
                },
            ]),
            subscription_module_1.SubscriptionModule,
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, subscription_service_1.SubscriptionService, stripe_1.StripeService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map