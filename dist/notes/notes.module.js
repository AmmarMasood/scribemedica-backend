"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesModule = void 0;
const common_1 = require("@nestjs/common");
const notes_controller_1 = require("./notes.controller");
const notes_service_1 = require("./notes.service");
const mongoose_1 = require("@nestjs/mongoose");
const note_schema_1 = require("./schemas/note.schema");
const note_detail_schema_1 = require("./schemas/note-detail.schema");
const profile_schema_1 = require("../auth/schemas/profile.schema");
const subscription_plan_schema_1 = require("../subscription/schemas/subscription-plan.schema");
let NotesModule = class NotesModule {
};
NotesModule = __decorate([
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
        controllers: [notes_controller_1.NotesController],
        providers: [notes_service_1.NotesService],
    })
], NotesModule);
exports.NotesModule = NotesModule;
//# sourceMappingURL=notes.module.js.map