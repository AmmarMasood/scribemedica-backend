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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const profile_schema_1 = require("../auth/schemas/profile.schema");
const subscription_plan_schema_1 = require("../subscription/schemas/subscription-plan.schema");
const note_detail_schema_1 = require("../notes/schemas/note-detail.schema");
const note_schema_1 = require("../notes/schemas/note.schema");
let AdminService = class AdminService {
    constructor(noteModel, noteDetailModel, profileModel, subscriptionPlanModel) {
        this.noteModel = noteModel;
        this.noteDetailModel = noteDetailModel;
        this.profileModel = profileModel;
        this.subscriptionPlanModel = subscriptionPlanModel;
    }
    async getNotes(user, noteType, page, limit, search) {
        try {
            this.isAdminUser(user);
            const filter = {};
            if (noteType && noteType !== 'all') {
                filter.type = noteType;
            }
            if (search) {
                filter.patientName = { $regex: new RegExp(search, 'i') };
            }
            const skip = (page - 1) * limit;
            const notes = await this.noteModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            const noteIds = notes.map((note) => note._id);
            const noteDetails = await this.noteDetailModel.find({
                noteId: { $in: noteIds },
            });
            const userIds = notes.map((note) => note.userId);
            const profiles = await this.profileModel.find({
                userId: { $in: userIds },
            });
            const notesWithDetails = notes.map((note) => {
                const noteDetail = noteDetails.find((detail) => detail.noteId.toString() === note._id.toString());
                return Object.assign(Object.assign({}, note.toObject()), { noteDetail });
            });
            notesWithDetails.forEach((note) => {
                const profile = profiles.find((profile) => profile.userId.toString() === note.userId.toString());
                note.profile = profile;
            });
            return notesWithDetails;
        }
        catch (e) {
            throw new Error('Unable to get notes');
        }
    }
    async getNoteDetails(noteId, user) {
        try {
            this.isAdminUser(user);
            const note = await this.noteModel.findOne({
                _id: noteId,
            });
            if (!note)
                throw new Error('Unable to find note');
            const noteDetail = await this.noteDetailModel.findOne({
                noteId: note._id,
            });
            const userDetail = await this.profileModel.findOne({
                userId: note.userId,
            });
            return {
                note,
                noteDetail,
                userDetail,
            };
        }
        catch (e) {
            throw new Error('Unable to get note details');
        }
    }
    async deleteNote(user, noteId) {
        try {
            this.isAdminUser(user);
            const note = await this.noteModel.findOne({
                _id: noteId,
            });
            const noteDetail = await this.noteDetailModel.findOne({
                noteId: note._id,
            });
            if (!note)
                throw new Error('Unable to find note');
            await this.noteModel.deleteOne({
                _id: note._id,
            });
            await this.noteDetailModel.deleteOne({
                _id: noteDetail._id,
            });
            return {
                note,
            };
        }
        catch (e) {
            throw new Error('Unable to delete note');
        }
    }
    async getUsers(user, page, limit, search) {
        try {
            this.isAdminUser(user);
            const filter = {
                role: { $ne: 'ADMIN' },
            };
            if (search) {
                filter.fullName = { $regex: new RegExp(search, 'i') };
            }
            const skip = (page - 1) * limit;
            const users = await this.profileModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
            const userIds = users.map((user) => user.userId);
            const notesCount = await this.noteModel.aggregate([
                {
                    $match: {
                        userId: { $in: userIds },
                    },
                },
                {
                    $group: {
                        _id: '$userId',
                        count: { $sum: 1 },
                    },
                },
            ]);
            const subscriptionIds = users.map((user) => user.subscriptionId);
            const subscriptions = await this.subscriptionPlanModel.find({
                _id: { $in: subscriptionIds },
            });
            const userWithNotesCount = users.map((user) => {
                const notes = notesCount.find((note) => note._id.toString() === user.userId.toString());
                return Object.assign(Object.assign({}, user.toObject()), { notesCount: notes ? notes.count : 0 });
            });
            userWithNotesCount.forEach((user) => {
                const subscription = subscriptions.find((subscription) => subscription._id.toString() === user.subscriptionId.toString());
                user.subscriptionDetail = subscription;
            });
            return userWithNotesCount;
        }
        catch (e) {
            throw new Error('Unable to get users');
        }
    }
    async deleteUser(user, userId) {
        try {
            this.isAdminUser(user);
            const profile = await this.profileModel.findOne({
                userId: userId,
            });
            if (!profile)
                throw new Error('Unable to find user');
            await this.profileModel.deleteOne({
                userId: profile.userId,
            });
            const noteIds = await this.noteModel.find({
                userId: profile.userId,
            });
            await this.noteModel.deleteMany({
                userId: profile.userId,
            });
            await this.noteDetailModel.deleteMany({
                noteId: { $in: noteIds },
            });
            await this.subscriptionPlanModel.deleteOne({
                _id: profile.subscriptionId,
            });
            return {
                profile,
            };
        }
        catch (e) {
            console.log(e);
            throw new Error('Unable to delete user');
        }
    }
    async getUserProfile(user, userId) {
        try {
            this.isAdminUser(user);
            const profile = await this.profileModel.findOne({
                userId: userId,
            });
            const subscription = await this.subscriptionPlanModel.findById(profile.subscriptionId);
            const notes = await this.noteModel.count({ userId: userId });
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
    async isAdminUserCheck(user) {
        try {
            const profile = await this.profileModel.findOne({
                userId: user.userId,
            });
            const isAdmin = profile.role === 'ADMIN';
            if (isAdmin) {
                return { isAdmin: true };
            }
            else {
                return { isAdmin: false };
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Somthing went wrong');
        }
    }
    async isAdminUser(user) {
        try {
            const profile = await this.profileModel.findOne({
                userId: user.userId,
            });
            const isAdmin = profile.role === 'ADMIN';
            if (isAdmin) {
                return true;
            }
            else {
                throw new common_1.ForbiddenException('User is not an admin');
            }
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Somthing went wrong');
        }
    }
};
AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(note_schema_1.Note.name)),
    __param(1, (0, mongoose_1.InjectModel)(note_detail_schema_1.NoteDetail.name)),
    __param(2, (0, mongoose_1.InjectModel)(profile_schema_1.Profile.name)),
    __param(3, (0, mongoose_1.InjectModel)(subscription_plan_schema_1.SubscriptionPlan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map