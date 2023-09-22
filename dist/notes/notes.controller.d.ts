/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { NotesService } from './notes.service';
import { CreateDto } from './dto/create.dto';
import { Request } from 'express';
import { UpdateDto } from './dto/update.dto';
import { NoteDetailUpsertDto } from './dto/note-detail-upsert.dto';
import { NoteDetailGenerateDto } from './dto/note-detail-generate.dto';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    getNotes(req: Request, noteType: string, page: number, limit: number, search: string): Promise<{
        noteDetail: import("mongoose").Document<unknown, {}, import("./schemas/note-detail.schema").NoteDetail> & import("./schemas/note-detail.schema").NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
        userId: string;
        description: string;
        patientName: string;
        patientGender: string;
        type: string;
        transcription: string;
        recordingLength: number;
        finalized: boolean;
        _id: import("mongoose").Types.ObjectId;
    }[]>;
    getNoteDetails(noteId: string, req: Request): Promise<{
        note: import("mongoose").Document<unknown, {}, import("./schemas/note.schema").Note> & import("./schemas/note.schema").Note & {
            _id: import("mongoose").Types.ObjectId;
        };
        noteDetail: import("mongoose").Document<unknown, {}, import("./schemas/note-detail.schema").NoteDetail> & import("./schemas/note-detail.schema").NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    register(createDto: CreateDto, req: Request): Promise<import("mongoose").Document<unknown, {}, import("./schemas/note.schema").Note> & import("./schemas/note.schema").Note & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    update(updateDto: UpdateDto, req: Request, noteId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/note.schema").Note> & import("./schemas/note.schema").Note & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    generate(req: Request, noteDetailGenerateDto: NoteDetailGenerateDto): Promise<{
        note: any;
        model: any;
    }>;
    finalize(req: Request, noteDetailUpsertDto: NoteDetailUpsertDto, noteId: string): Promise<{
        note: import("mongoose").Document<unknown, {}, import("./schemas/note.schema").Note> & import("./schemas/note.schema").Note & {
            _id: import("mongoose").Types.ObjectId;
        };
        noteDetail: import("mongoose").Document<unknown, {}, import("./schemas/note-detail.schema").NoteDetail> & import("./schemas/note-detail.schema").NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    updateNoteDetail(req: Request, NoteDetailUpsertDto: NoteDetailUpsertDto, noteDetailId: string): Promise<{
        updatedNoteDetail: import("mongoose").Document<unknown, {}, import("./schemas/note-detail.schema").NoteDetail> & import("./schemas/note-detail.schema").NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    deletenote(req: Request, noteId: string): Promise<{
        note: import("mongoose").Document<unknown, {}, import("./schemas/note.schema").Note> & import("./schemas/note.schema").Note & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
}
