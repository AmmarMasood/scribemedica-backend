import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsTranscriptLongerThan500Characters } from 'src/validators/custom-validator';
import { PatientGender } from './update.dto';
import { NoteType } from './note-detail-upsert.dto';

export class NoteDetailGenerateDto {
  @IsTranscriptLongerThan500Characters()
  @IsNotEmpty()
  transcript: string;

  @IsEnum(NoteType)
  @IsNotEmpty()
  noteType: string;

  @IsEnum(PatientGender)
  @IsNotEmpty()
  patientGender: string;
}
