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
import { Profile } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { SubscriptionPlan } from 'src/subscription/schemas/subscription-plan.schema';
import { ProfileUpdateDto } from './dto/updateProfile.dto';
import { Note } from 'src/notes/schemas/note.schema';
export declare class AuthService {
    private profileModel;
    private noteModel;
    private subscriptionPlanModel;
    private readonly subscriptionService;
    constructor(profileModel: Model<Profile>, noteModel: Model<Note>, subscriptionPlanModel: Model<SubscriptionPlan>, subscriptionService: any);
    register(registerDto: RegisterDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
    }>;
    getUserProfile(user: any): Promise<{
        profile: import("mongoose").Document<unknown, {}, Profile> & Profile & {
            _id: import("mongoose").Types.ObjectId;
        };
        notesCount: number;
        subscription: import("mongoose").Document<unknown, {}, SubscriptionPlan> & SubscriptionPlan & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    updateProfile(user: any, updateDto: ProfileUpdateDto): Promise<import("mongoose").Document<unknown, {}, Profile> & Profile & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
