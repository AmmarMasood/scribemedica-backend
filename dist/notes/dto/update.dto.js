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
exports.UpdateDto = exports.PatientGender = void 0;
const class_validator_1 = require("class-validator");
var PatientGender;
(function (PatientGender) {
    PatientGender["SHE"] = "she/her";
    PatientGender["HE"] = "he/him";
    PatientGender["THEY"] = "they/them";
})(PatientGender = exports.PatientGender || (exports.PatientGender = {}));
class UpdateDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDto.prototype, "patientName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(PatientGender),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDto.prototype, "patientGender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateDto.prototype, "transcription", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], UpdateDto.prototype, "recordingLength", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], UpdateDto.prototype, "finalized", void 0);
exports.UpdateDto = UpdateDto;
//# sourceMappingURL=update.dto.js.map