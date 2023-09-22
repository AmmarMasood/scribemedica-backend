export declare enum PatientGender {
    SHE = "she/her",
    HE = "he/him",
    THEY = "they/them"
}
export declare class UpdateDto {
    description: string;
    patientName: string;
    patientGender: string;
    transcription: string;
    recordingLength: number;
    finalized: boolean;
}
