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
import { AdminService } from './admin.service';
import { Request } from 'express';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getNotes(req: Request, noteType: string, page: number, limit: number, search: string): Promise<{
        noteDetail: import("mongoose").Document<unknown, {}, import("../notes/schemas/note-detail.schema").NoteDetail> & import("../notes/schemas/note-detail.schema").NoteDetail & {
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
    getNoteDetail(noteId: string, req: Request): Promise<{
        note: import("mongoose").Document<unknown, {}, import("../notes/schemas/note.schema").Note> & import("../notes/schemas/note.schema").Note & {
            _id: import("mongoose").Types.ObjectId;
        };
        noteDetail: import("mongoose").Document<unknown, {}, import("../notes/schemas/note-detail.schema").NoteDetail> & import("../notes/schemas/note-detail.schema").NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
        userDetail: import("mongoose").Document<unknown, {}, import("../auth/schemas/profile.schema").Profile> & import("../auth/schemas/profile.schema").Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getUserDetail(userId: string, req: Request): Promise<{
        userDetail: import("mongoose").Document<unknown, {}, import("../auth/schemas/profile.schema").Profile> & import("../auth/schemas/profile.schema").Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
        subscription: import("mongoose").Document<unknown, {}, import("../subscription/schemas/subscription-plan.schema").SubscriptionPlan> & import("../subscription/schemas/subscription-plan.schema").SubscriptionPlan & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    deleteNotes(noteId: string, req: Request): Promise<{
        note: import("mongoose").Document<unknown, {}, import("../notes/schemas/note.schema").Note> & import("../notes/schemas/note.schema").Note & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getUsers(req: Request, page: number, limit: number, search: string): Promise<{
        notesCount: any;
        fullName: string;
        email: string;
        userId: string;
        role: string;
        profession: string;
        country: string;
        speciality: string;
        phoneNumber: string;
        subscriptionId: import("bson").ObjectId;
        notesAllowed: number;
        notesCreated: number;
        _id: import("mongoose").Types.ObjectId;
    }[]>;
    deleteUser(userId: string, req: Request): Promise<{
        profile: import("mongoose").Document<unknown, {}, import("../auth/schemas/profile.schema").Profile> & import("../auth/schemas/profile.schema").Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    checkIfIsAdmin(req: Request): Promise<{
        isAdmin: boolean;
    }>;
}
