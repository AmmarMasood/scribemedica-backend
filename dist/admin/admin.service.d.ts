import { Model } from 'mongoose';
import { Profile } from 'src/auth/schemas/profile.schema';
import { SubscriptionPlan } from 'src/subscription/schemas/subscription-plan.schema';
import { NoteDetail } from 'src/notes/schemas/note-detail.schema';
import { Note } from 'src/notes/schemas/note.schema';
export declare class AdminService {
    private noteModel;
    private noteDetailModel;
    private profileModel;
    private subscriptionPlanModel;
    constructor(noteModel: Model<Note>, noteDetailModel: Model<NoteDetail>, profileModel: Model<Profile>, subscriptionPlanModel: Model<SubscriptionPlan>);
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
        _id: import("mongoose").Types.ObjectId;
    }[]>;
    getNoteDetails(noteId: string, user: any): Promise<{
        note: import("mongoose").Document<unknown, {}, Note> & Note & {
            _id: import("mongoose").Types.ObjectId;
        };
        noteDetail: import("mongoose").Document<unknown, {}, NoteDetail> & NoteDetail & {
            _id: import("mongoose").Types.ObjectId;
        };
        userDetail: import("mongoose").Document<unknown, {}, Profile> & Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getUserDetails(userId: string, user: any): Promise<{
        userDetail: import("mongoose").Document<unknown, {}, Profile> & Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
        subscription: import("mongoose").Document<unknown, {}, SubscriptionPlan> & SubscriptionPlan & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    deleteNote(user: any, noteId: string): Promise<{
        note: import("mongoose").Document<unknown, {}, Note> & Note & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getUsers(user: any, page: number, limit: number, search: string): Promise<{
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
    deleteUser(user: any, userId: string): Promise<{
        profile: import("mongoose").Document<unknown, {}, Profile> & Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    getUserProfile(user: any, userId: string): Promise<{
        profile: import("mongoose").Document<unknown, {}, Profile> & Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
        notesCount: number;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionPlan> & SubscriptionPlan & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    isAdminUserCheck(user: any): Promise<{
        isAdmin: boolean;
    }>;
    private isAdminUser;
}
