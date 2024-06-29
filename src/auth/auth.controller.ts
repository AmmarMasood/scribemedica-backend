import { Body, Controller, Get, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { ProfileUpdateDto } from './dto/updateProfile.dto';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Get('private/auth/profile')
  async profileInfo(@Req() req: Request) {
    return await this.authService.getUserProfile(req['user']);
  }

  @Put('private/auth/profile')
  async profileUpdate(
    @Req() req: Request,
    @Body() updateDto: ProfileUpdateDto,
  ) {
    return await this.authService.updateProfile(req['user'], updateDto);
  }
}
