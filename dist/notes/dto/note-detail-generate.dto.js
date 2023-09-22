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
exports.NoteDetailGenerateDto = void 0;
const class_validator_1 = require("class-validator");
const custom_validator_1 = require("../../validators/custom-validator");
const update_dto_1 = require("./update.dto");
const note_detail_upsert_dto_1 = require("./note-detail-upsert.dto");
class NoteDetailGenerateDto {
}
__decorate([
    (0, custom_validator_1.IsTranscriptLongerThan500Characters)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NoteDetailGenerateDto.prototype, "transcript", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(note_detail_upsert_dto_1.NoteType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NoteDetailGenerateDto.prototype, "noteType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(update_dto_1.PatientGender),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], NoteDetailGenerateDto.prototype, "patientGender", void 0);
exports.NoteDetailGenerateDto = NoteDetailGenerateDto;
//# sourceMappingURL=note-detail-generate.dto.js.map