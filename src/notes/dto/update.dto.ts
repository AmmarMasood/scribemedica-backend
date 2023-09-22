import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PatientGender {
  SHE = 'she/her',
  HE = 'he/him',
  THEY = 'they/them',
}

export class UpdateDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  patientName: string;

  @IsEnum(PatientGender)
  @IsOptional()
  patientGender: string;

  @IsString()
  @IsOptional()
  transcription: string;

  @IsNumber()
  @IsNotEmpty()
  recordingLength: number;

  @IsBoolean()
  @IsNotEmpty()
  finalized: boolean;
}
