import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProfileUpdateDto {
  @IsString()
  @IsOptional()
  profession: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  speciality: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsOptional()
  heardAboutUs: string;
}
