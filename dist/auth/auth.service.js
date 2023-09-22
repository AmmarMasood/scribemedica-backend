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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const profile_schema_1 = require("./schemas/profile.schema");
const mongoose_2 = require("mongoose");
const subscription_service_1 = require("../subscription/subscription.service");
const plans_1 = require("../subscription/config/plans");
const subscription_plan_schema_1 = require("../subscription/schemas/subscription-plan.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
let AuthService = class AuthService {
    constructor(profileModel, noteModel, subscriptionPlanModel, subscriptionService) {
        this.profileModel = profileModel;
        this.noteModel = noteModel;
        this.subscriptionPlanModel = subscriptionPlanModel;
        this.subscriptionService = subscriptionService;
    }
    async register(registerDto) {
        try {
            const { fullName, userId } = registerDto;
            const checkIfUserExist = await this.profileModel.exists({ userId });
            if (checkIfUserExist) {
                return checkIfUserExist;
            }
            const subscription = await this.subscriptionService.initalizeFreeSubscription(userId);
            const profile = await this.profileModel.create({
                fullName,
                userId,
                subscriptionId: subscription._id,
                notesAllowed: (0, plans_1.getNotesBasedOnPlan)(subscription.planId),
            });
            return profile;
        }
        catch (e) {
            console.log(e);
            throw new Error('Unable to register user');
        }
    }
    async getUserProfile(user) {
        try {
            const profile = await this.profileModel.findOne({
                userId: user.userId,
            });
            const subscription = await this.subscriptionPlanModel.findById(profile.subscriptionId);
            const notes = await this.noteModel.count({ userId: user.userId });
            return {
                profile: profile,
                notesCount: notes,
                subscription,
            };
        }
        catch (err) {
            throw new Error('Unable to get user profile');
        }
    }
    async updateProfile(user, updateDto) {
        try {
            const profile = await this.profileModel.findOneAndUpdate({ userId: user.userId }, updateDto, { new: true });
            return profile;
        }
        catch (e) {
            console.log(e);
            throw new Error('Unable to update profile');
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(profile_schema_1.Profile.name)),
    __param(1, (0, mongoose_1.InjectModel)(note_schema_1.Note.name)),
    __param(2, (0, mongoose_1.InjectModel)(subscription_plan_schema_1.SubscriptionPlan.name)),
    __param(3, (0, common_1.Inject)(subscription_service_1.SubscriptionService)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model, Object])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map