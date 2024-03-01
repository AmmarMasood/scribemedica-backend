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
exports.NoteDetailUpsertDto = exports.NoteType = void 0;
const class_validator_1 = require("class-validator");
const update_dto_1 = require("./update.dto");
var NoteType;
(function (NoteType) {
    NoteType["SYSTEM_BASED_ASSESSMENT_AND_PLAN"] = "System Based Assessment And Plan";
    NoteType["CLINICAL_DISCUSSION"] = "Clinical Discussion";
})(NoteType || (exports.NoteType = NoteType = {}));
class NoteDetailUpsertDto {
}
exports.NoteDetailUpsertDto = NoteDetailUpsertDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoteDetailUpsertDto.prototype, "transcript", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoteDetailUpsertDto.prototype, "medicalNote", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoteDetailUpsertDto.prototype, "modelUsed", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NoteType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoteDetailUpsertDto.prototype, "noteType", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(update_dto_1.PatientGender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], NoteDetailUpsertDto.prototype, "patientGender", void 0);
//# sourceMappingURL=note-detail-upsert.dto.js.map