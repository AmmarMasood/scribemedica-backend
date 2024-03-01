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
exports.NotesController = void 0;
const common_1 = require("@nestjs/common");
const notes_service_1 = require("./notes.service");
const create_dto_1 = require("./dto/create.dto");
const update_dto_1 = require("./dto/update.dto");
const note_detail_upsert_dto_1 = require("./dto/note-detail-upsert.dto");
const note_detail_generate_dto_1 = require("./dto/note-detail-generate.dto");
let NotesController = exports.NotesController = class NotesController {
    constructor(notesService) {
        this.notesService = notesService;
    }
    async getNotes(req, noteType, page, limit, search) {
        return await this.notesService.getNotes(req['user'], noteType, page, limit, search);
    }
    async getNoteDetails(noteId, req) {
        return await this.notesService.getNoteDetails(noteId, req['user']);
    }
    async register(createDto, req) {
        return await this.notesService.createNew(createDto, req['user']);
    }
    async update(updateDto, req, noteId) {
        return await this.notesService.updateNote(updateDto, req['user'], noteId);
    }
    async generate(req, noteDetailGenerateDto) {
        return await this.notesService.generateDetails(req['user'], noteDetailGenerateDto);
    }
    async finalize(req, noteDetailUpsertDto, noteId) {
        return await this.notesService.finalize(req['user'], noteDetailUpsertDto, noteId);
    }
    async updateNoteDetail(req, NoteDetailUpsertDto, noteDetailId) {
        return await this.notesService.updateNoteDetail(req['user'], NoteDetailUpsertDto, noteDetailId);
    }
    async deletenote(req, noteId) {
        return await this.notesService.deleteNote(req['user'], noteId);
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('noteType')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getNotes", null);
__decorate([
    (0, common_1.Get)('/:noteId'),
    __param(0, (0, common_1.Param)('noteId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "getNoteDetails", null);
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_dto_1.CreateDto, Object]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "register", null);
__decorate([
    (0, common_1.Put)('/:noteId'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_dto_1.UpdateDto, Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('/generate-details'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, note_detail_generate_dto_1.NoteDetailGenerateDto]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('/:noteId/finalize'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, note_detail_upsert_dto_1.NoteDetailUpsertDto, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "finalize", null);
__decorate([
    (0, common_1.Put)('/detail/:noteDetailId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)('noteDetailId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, note_detail_upsert_dto_1.NoteDetailUpsertDto, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "updateNoteDetail", null);
__decorate([
    (0, common_1.Delete)('/:noteId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('noteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotesController.prototype, "deletenote", null);
exports.NotesController = NotesController = __decorate([
    (0, common_1.Controller)('/private/notes'),
    __metadata("design:paramtypes", [notes_service_1.NotesService])
], NotesController);
//# sourceMappingURL=notes.controller.js.map