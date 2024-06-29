import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
