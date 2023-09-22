import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PatientGender } from './update.dto';

export enum NoteType {
  SYSTEM_BASED_ASSESSMENT_AND_PLAN = 'System Based Assessment And Plan',
  CLINICAL_DISCUSSION = 'Clinical Discussion',
}

export class NoteDetailUpsertDto {
  @IsString()
  @IsOptional()
  transcript: string;

  @IsString()
  @IsOptional()
  medicalNote: string;

  @IsString()
  @IsOptional()
  modelUsed: string;

  @IsEnum(NoteType)
  @IsOptional()
  noteType: string;

  @IsEnum(PatientGender)
  @IsOptional()
  patientGender: string;
}
