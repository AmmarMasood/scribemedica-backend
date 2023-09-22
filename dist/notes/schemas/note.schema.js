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
exports.NoteSchema = exports.Note = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var PatientGender;
(function (PatientGender) {
    PatientGender["SHE"] = "she/her";
    PatientGender["HE"] = "he/him";
    PatientGender["THEY"] = "they/them";
})(PatientGender || (PatientGender = {}));
var NoteType;
(function (NoteType) {
    NoteType["INPATIENT"] = "inpatient";
    NoteType["OUTPATIENT"] = "outpatient";
    NoteType["DICTATION"] = "dictation";
})(NoteType || (NoteType = {}));
let Note = class Note {
};
__decorate([
    (0, mongoose_1.Prop)({ type: String, ref: 'Profile', required: true }),
    __metadata("design:type", String)
], Note.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Note.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'patientName is required'],
    }),
    __metadata("design:type", String)
], Note.prototype, "patientName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(PatientGender),
    }),
    __metadata("design:type", String)
], Note.prototype, "patientGender", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'note type is required'],
        type: String,
        enum: Object.values(NoteType),
        default: NoteType.INPATIENT,
    }),
    __metadata("design:type", String)
], Note.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Note.prototype, "transcription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Note.prototype, "recordingLength", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'finalized is required'],
    }),
    __metadata("design:type", Boolean)
], Note.prototype, "finalized", void 0);
Note = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Note);
exports.Note = Note;
exports.NoteSchema = mongoose_1.SchemaFactory.createForClass(Note);
//# sourceMappingURL=note.schema.js.map