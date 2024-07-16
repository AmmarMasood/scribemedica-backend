import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';
import { UpdateDto } from './dto/update.dto';
import { NoteDetailUpsertDto } from './dto/note-detail-upsert.dto';
import { NoteDetailGenerateDto } from './dto/note-detail-generate.dto';

@Controller('/private/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async getNotes(
    @Req() req: Request,
    @Query('noteType') noteType: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    return await this.notesService.getNotes(
      req['user'],
      noteType,
      page,
      limit,
      search,
    );
  }

  @Get('/:noteId')
  async getNoteDetails(@Param('noteId') noteId: string, @Req() req: Request) {
    return await this.notesService.getNoteDetails(noteId, req['user']);
  }

  @Post('/create')
  async register(@Body() createDto: CreateDto, @Req() req: Request) {
    return await this.notesService.createNew(createDto, req['user']);
  }

  @Put('/:noteId')
  async update(
    @Body() updateDto: UpdateDto,
    @Req() req: Request,
    @Param('noteId') noteId: string,
  ) {
    return await this.notesService.updateNote(updateDto, req['user'], noteId);
  }

  @Post('/generate-details')
  async generate(
    @Req() req: Request,
    @Body() noteDetailGenerateDto: NoteDetailGenerateDto,
  ) {
    return await this.notesService.generateDetails(
      req['user'],
      noteDetailGenerateDto,
    );
  }

  @Post('/:noteId/finalize')
  async finalize(
    @Req() req: Request,
    @Body() noteDetailUpsertDto: NoteDetailUpsertDto,
    @Param('noteId') noteId: string,
  ) {
    return await this.notesService.finalize(
      req['user'],
      noteDetailUpsertDto,
      noteId,
    );
  }

  @Put('/detail/:noteDetailId')
  async updateNoteDetail(
    @Req() req: Request,
    @Body() NoteDetailUpsertDto: NoteDetailUpsertDto,
    @Param('noteDetailId') noteDetailId: string,
  ) {
    return await this.notesService.updateNoteDetail(
      req['user'],
      NoteDetailUpsertDto,
      noteDetailId,
    );
  }

  @Delete('/:noteId')
  async deletenote(@Req() req: Request, @Param('noteId') noteId: string) {
    return await this.notesService.deleteNote(req['user'], noteId);
  }

  @Delete('/cleanup/notes')
  async cleanupNotes(@Req() req: Request) {
    return await this.notesService.hardDeleteOldNotes();
  }

  // @Get('/read/notes')
  // async readNotes(@Req() req: Request) {
  //   return await this.notesService.readPromptFromGooglDoc();
  // }
}
