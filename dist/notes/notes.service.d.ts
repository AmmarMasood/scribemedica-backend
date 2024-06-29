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
/// <reference types="mongoose/types/inferschematype" />
import { CreateDto } from './dto/create.dto';
import { Note } from './schemas/note.schema';
import { Model } from 'mongoose';
import { UpdateDto } from './dto/update.dto';
import { NoteDetailUpsertDto } from './dto/note-detail-upsert.dto';
import { NoteDetail } from './schemas/note-detail.schema';
import { NoteDetailGenerateDto } from './dto/note-detail-generate.dto';
import { Profile } from 'src/auth/schemas/profile.schema';
import { SubscriptionPlan } from 'src/subscription/schemas/subscription-plan.schema';
export declare class NotesService {
    private noteModel;
    private noteDetailModel;
    private profileModel;
    private subscriptionPlanModel;
    private openai;
    private azureOpenAi;
    constructor(noteModel: Model<Note>, noteDetailModel: Model<NoteDetail>, profileModel: Model<Profile>, subscriptionPlanModel: Model<SubscriptionPlan>);
    createNew(createDto: CreateDto, user: any): Promise<import("mongoose").Document<unknown, {}, Note> & Note & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateNote(updateDto: UpdateDto, user: any, noteId: string): Promise<import("mongoose").Document<unknown, {}, Note> & Note & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    finalize(user: any, noteDetailUpsertDto: NoteDetailUpsertDto, noteId: string): Promise<{
        note: import("mongoose").Document<unknown, {}, Note> & Note & {
            _id: import("mongoose").Types.ObjectId;
        };
        noteDetail: import("mongoose").Document<unknown, {}, NoteDetail> & NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    updateNoteDetail(user: any, noteDetailUpsertDto: NoteDetailUpsertDto, noteDetailId: string): Promise<{
        updatedNoteDetail: import("mongoose").Document<unknown, {}, NoteDetail> & NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    generateDetails(user: any, noteDetailGenerateDto: NoteDetailGenerateDto): Promise<{
        note: any;
        model: any;
    }>;
    generateWithOpenAI(text: any, transcript: any, noteType: any): Promise<{
        note: any;
        model: any;
    }>;
    generateDetailWithAzure(text: any, transcript: any, noteType: any): Promise<{
        note: any;
        model: any;
    }>;
    getNotes(user: any, noteType: string, page: number, limit: number, search: string): Promise<{
        noteDetail: import("mongoose").Document<unknown, {}, NoteDetail> & NoteDetail & {
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
        deleted: boolean;
        _id: import("mongoose").Types.ObjectId;
    }[]>;
    getNoteDetails(noteId: string, user: any): Promise<{
        note: import("mongoose").Document<unknown, {}, Note> & Note & {
            _id: import("mongoose").Types.ObjectId;
        };
        noteDetail: import("mongoose").Document<unknown, {}, NoteDetail> & NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    deleteNote(user: any, noteId: string): Promise<{
        note: import("mongoose").Document<unknown, {}, Note> & Note & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    hardDeleteOldNotes(): Promise<{
        deletedNotes: number;
    }>;
}
