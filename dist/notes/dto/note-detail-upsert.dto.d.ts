export declare enum NoteType {
    SYSTEM_BASED_ASSESSMENT_AND_PLAN = "Standard Length",
    CLINICAL_DISCUSSION = "Concise"
}
export declare class NoteDetailUpsertDto {
    transcript: string;
    medicalNote: string;
    modelUsed: string;
    noteType: string;
    patientGender: string;
}
