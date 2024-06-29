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
exports.NoteDetailSchema = exports.NoteDetail = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const note_detail_upsert_dto_1 = require("../dto/note-detail-upsert.dto");
let NoteDetail = class NoteDetail {
};
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Note', required: true }),
    __metadata("design:type", Object)
], NoteDetail.prototype, "noteId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NoteDetail.prototype, "medicalNote", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(note_detail_upsert_dto_1.NoteType),
    }),
    __metadata("design:type", String)
], NoteDetail.prototype, "noteType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'modelUsed is required'],
    }),
    __metadata("design:type", String)
], NoteDetail.prototype, "modelUsed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], NoteDetail.prototype, "deleted", void 0);
NoteDetail = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], NoteDetail);
exports.NoteDetail = NoteDetail;
exports.NoteDetailSchema = mongoose_1.SchemaFactory.createForClass(NoteDetail);
//# sourceMappingURL=note-detail.schema.js.map