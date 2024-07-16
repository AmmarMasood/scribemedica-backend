import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  description: string;

  @IsString()
  @IsNotEmpty()
  patientName: string;

  @IsString()
  @IsNotEmpty()
  patientGender: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsBoolean()
  @IsNotEmpty()
  finalized: boolean;
}
