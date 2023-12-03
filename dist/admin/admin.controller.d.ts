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
