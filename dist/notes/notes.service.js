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
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const note_schema_1 = require("./schemas/note.schema");
const mongoose_2 = require("mongoose");
const note_detail_schema_1 = require("./schemas/note-detail.schema");
const openai_1 = require("openai");
const profile_schema_1 = require("../auth/schemas/profile.schema");
const subscription_plan_schema_1 = require("../subscription/schemas/subscription-plan.schema");
const plans_1 = require("../subscription/config/plans");
const openai_2 = require("@azure/openai");
let NotesService = class NotesService {
    constructor(noteModel, noteDetailModel, profileModel, subscriptionPlanModel) {
        this.noteModel = noteModel;
        this.noteDetailModel = noteDetailModel;
        this.profileModel = profileModel;
        this.subscriptionPlanModel = subscriptionPlanModel;
        const apiKey = process.env.GPT_KEY;
        this.openai = new openai_1.default({
            apiKey: apiKey,
        });
        const azureOpenAiApiKey = process.env.AZURE_OPENAI_KEY;
        const azureOpenAiEndpoint = process.env.AZURE_ENDPOINT;
        this.azureOpenAi = new openai_2.OpenAIClient(azureOpenAiEndpoint, new openai_2.AzureKeyCredential(azureOpenAiApiKey));
    }
    async createNew(createDto, user) {
        try {
            const { patientName, type, finalized } = createDto;
            const profile = await this.profileModel.findOne({
                userId: user.userId,
            });
            const subscription = await this.subscriptionPlanModel.findOne({
                userId: user.userId,
            });
            if (subscription.planId === plans_1.SubscriptionPlans.FREE) {
                const notes = await this.noteModel.find({
                    userId: user.userId,
                });
                if (!(0, plans_1.isFreePlanActive)(subscription)) {
                    throw new Error('Your free plan has expired.');
                }
                if (profile.notesAllowed <= notes.length) {
                    throw new Error('You have reached your free plan notes limit');
                }
            }
            else {
                const notes = await this.noteModel.find({
                    userId: user.userId,
                    deleted: { $ne: true },
                });
                if (subscription.status === plans_1.SubscriptionPlanStatus.CANCELLED ||
                    subscription.status === plans_1.SubscriptionPlanStatus.INACTIVE) {
                    throw new Error('Your subscription is not active');
                }
                if (profile.notesAllowed <= notes.length) {
                    throw new Error(`You have reached your plan notes limit`);
                }
            }
            const newNote = await this.noteModel.create({
                patientName,
                type,
                finalized,
                userId: user.userId,
            });
            return newNote;
        }
        catch (e) {
            if (e.message === 'You have reached your free plan notes limit' ||
                e.message === 'Your free plan has expired.' ||
                e.message === 'Your subscription is not active' ||
                e.message === 'You have reached your plan notes limit') {
                throw new common_1.BadRequestException(e.message);
            }
            console.log('Error', e);
            throw new Error('Unable to create new note');
        }
    }
    async updateNote(updateDto, user, noteId) {
        try {
            const { patientName, patientGender, transcription, recordingLength, finalized, } = updateDto;
            const updatedNote = await this.noteModel.findOneAndUpdate({
                _id: noteId,
                userId: user.userId,
                deleted: { $ne: true },
            }, {
                patientName,
                patientGender,
                transcription,
                recordingLength,
                finalized,
            }, {
                new: true,
            });
            return updatedNote;
        }
        catch (e) {
            console.log(e);
            throw new Error('Unable to update note');
        }
    }
    async finalize(user, noteDetailUpsertDto, noteId) {
        try {
            const generated = await this.generateDetails(user, {
                transcript: noteDetailUpsertDto.transcript,
                noteType: noteDetailUpsertDto.noteType,
                patientGender: noteDetailUpsertDto.patientGender,
            });
            const finalizedNote = await this.noteModel.findOneAndUpdate({
                _id: noteId,
            }, {
                finalized: true,
                patientGender: noteDetailUpsertDto.patientGender,
            });
            if (!finalizedNote)
                throw new Error('Unable to finalize note');
            const finalizedNoteDetail = await this.noteDetailModel.create({
                medicalNote: generated.note,
                noteId: finalizedNote._id,
                modelUsed: generated.model,
                noteType: noteDetailUpsertDto.noteType,
            });
            return {
                note: finalizedNote,
                noteDetail: finalizedNoteDetail,
            };
        }
        catch (e) {
            throw new Error('Unable to finalize note');
        }
    }
    async updateNoteDetail(user, noteDetailUpsertDto, noteDetailId) {
        try {
            const updatedNoteDetail = await this.noteDetailModel.findOneAndUpdate({
                _id: noteDetailId,
                deleted: { $ne: true },
            }, Object.assign({}, noteDetailUpsertDto));
            return {
                updatedNoteDetail,
            };
        }
        catch (e) {
            throw new Error('Unable to finalize note');
        }
    }
    async generateDetails(user, noteDetailGenerateDto) {
        try {
            const profile = await this.profileModel.findOne({
                userId: user.userId,
            });
            const text = `Create a medical note based on with this transcript for the person here is the transcript ${noteDetailGenerateDto.transcript}`;
            if (profile.speciality) {
                text.concat(` and the speciality of the doctor who wrote this transcript is ${profile.speciality}, so make sure to create a note based on that speciality`);
            }
            const t = await this.generateDetailWithAzure(text, noteDetailGenerateDto.transcript, noteDetailGenerateDto.noteType);
            return t;
        }
        catch (err) {
            console.log(err);
            throw new Error('Unable to generate note details');
        }
    }
    async generateWithOpenAI(text, transcript, noteType) {
        try {
            const c2 = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: text,
                    },
                ],
            });
            const reply = c2.choices[0].message.content;
            const c3 = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'user',
                        content: `This is the medical note: ${reply} created against patient with this transcript ${transcript} for the patient. Enhance it and return a ${noteType}.`,
                    },
                ],
            });
            return {
                note: c3.choices[0].message.content,
                model: c3.model,
            };
        }
        catch (e) {
            console.log(e);
            throw new Error('Unable to generate note details');
        }
    }
    async generateDetailWithAzure(text, transcript, noteType) {
        try {
            const c2 = await this.azureOpenAi.getChatCompletions('scribemedica-gpt-35', [
                {
                    role: 'user',
                    content: text,
                },
            ], {});
            const reply = c2.choices[0].message.content;
            const c3 = await this.azureOpenAi.getChatCompletions('scribemedica-gpt-35', [
                {
                    role: 'user',
                    content: `This is the medical note: ${reply} created against patient with this transcript ${transcript} for the patient. Enhance it and return a ${noteType}.`,
                },
            ], {});
            return {
                note: c3.choices[0].message.content,
                model: c3.model,
            };
        }
        catch (err) {
            console.log(err);
            throw new Error('Unable to generate note details');
        }
    }
    async getNotes(user, noteType, page, limit, search) {
        try {
            const filter = { userId: user.userId, deleted: { $ne: true } };
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
                deleted: { $ne: true },
            });
            const notesWithDetails = notes.map((note) => {
                const noteDetail = noteDetails.find((detail) => detail.noteId.toString() === note._id.toString());
                return Object.assign(Object.assign({}, note.toObject()), { noteDetail });
            });
            return notesWithDetails;
        }
        catch (e) {
            throw new Error('Unable to get notes');
        }
    }
    async getNoteDetails(noteId, user) {
        try {
            const note = await this.noteModel.findOne({
                _id: noteId,
                userId: user.userId,
                deleted: { $ne: true },
            });
            if (!note)
                throw new Error('Unable to find note');
            const noteDetail = await this.noteDetailModel.findOne({
                noteId: note._id,
                deleted: { $ne: true },
            });
            return {
                note,
                noteDetail,
            };
        }
        catch (e) {
            throw new Error('Unable to get note details');
        }
    }
    async deleteNote(user, noteId) {
        try {
            const note = await this.noteModel.findOne({
                _id: noteId,
                userId: user.userId,
            });
            if (!note)
                throw new Error('Unable to find note');
            const noteDetail = await this.noteDetailModel.findOne({
                noteId: note._id,
            });
            note.deleted = true;
            await note.save();
            if (noteDetail) {
                noteDetail.deleted = true;
                await noteDetail.save();
            }
            return {
                note,
            };
        }
        catch (e) {
            throw new Error('Unable to delete note');
        }
    }
    async hardDeleteOldNotes() {
        const days = parseInt(process.env.NOTES_EXPIRY_LIMIT_DAYS) || 30;
        const notes = await this.noteModel.find({
            createdAt: { $lt: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
        });
        await this.noteModel.deleteMany({
            createdAt: { $lt: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
        });
        await this.noteDetailModel.deleteMany({
            noteId: { $in: notes.map((note) => note._id) },
        });
        return {
            deletedNotes: notes.length,
        };
    }
};
NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(note_schema_1.Note.name)),
    __param(1, (0, mongoose_1.InjectModel)(note_detail_schema_1.NoteDetail.name)),
    __param(2, (0, mongoose_1.InjectModel)(profile_schema_1.Profile.name)),
    __param(3, (0, mongoose_1.InjectModel)(subscription_plan_schema_1.SubscriptionPlan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], NotesService);
exports.NotesService = NotesService;
//# sourceMappingURL=notes.service.js.map