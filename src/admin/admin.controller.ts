import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request } from 'express';

@Controller('/private/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('/notes')
  async getNotes(
    @Req() req: Request,
    @Query('noteType') noteType: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return await this.adminService.getNotes(
      req.user,
      noteType,
      page,
      limit,
      search,
    );
  }

  @Get('/notes/:noteId')
  async getNoteDetail(@Param('noteId') noteId: string, @Req() req: Request) {
    return this.adminService.getNoteDetails(noteId, req.user);
  }

  @Delete('/notes/:noteId')
  async deleteNotes(@Param('noteId') noteId: string, @Req() req: Request) {
    return this.adminService.deleteNote(req.user, noteId);
  }

  @Get('/users')
  async getUsers(
    @Req() req: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return this.adminService.getUsers(req.user, page, limit, search);
  }

  @Delete('/user/:userId')
  async deleteUser(@Param('userId') userId: string, @Req() req: Request) {
    return this.adminService.deleteUser(req.user, userId);
  }

  @Get('/')
  async checkIfIsAdmin(@Req() req: Request) {
    return this.adminService.isAdminUserCheck(req.user);
  }
}
