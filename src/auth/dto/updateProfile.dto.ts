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
  @IsNotEmpty()
  fullName: string;
}
