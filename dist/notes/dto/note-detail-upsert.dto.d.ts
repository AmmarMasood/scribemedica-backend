export declare enum NoteType {
    SYSTEM_BASED_ASSESSMENT_AND_PLAN = "System Based Assessment And Plan",
    CLINICAL_DISCUSSION = "Clinical Discussion"
}
export declare class NoteDetailUpsertDto {
    transcript: string;
    medicalNote: string;
    modelUsed: string;
    noteType: string;
    patientGender: string;
}
