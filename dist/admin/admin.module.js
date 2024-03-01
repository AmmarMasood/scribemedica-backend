"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const profile_schema_1 = require("../auth/schemas/profile.schema");
const subscription_plan_schema_1 = require("../subscription/schemas/subscription-plan.schema");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const mongoose_1 = require("@nestjs/mongoose");
const note_schema_1 = require("../notes/schemas/note.schema");
const note_detail_schema_1 = require("../notes/schemas/note-detail.schema");
let AdminModule = exports.AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: 'Note',
                    schema: note_schema_1.NoteSchema,
                },
                {
                    name: 'NoteDetail',
                    schema: note_detail_schema_1.NoteDetailSchema,
                },
                {
                    name: 'Profile',
                    schema: profile_schema_1.ProfileSchema,
                },
                {
                    name: 'SubscriptionPlan',
                    schema: subscription_plan_schema_1.SubscriptionPlanSchema,
                },
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map