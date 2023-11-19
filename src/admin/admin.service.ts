import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUser } from 'src/auth/interface/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from 'src/auth/schemas/profile.schema';
import { SubscriptionPlan } from 'src/subscription/schemas/subscription-plan.schema';
import {
  SubscriptionPlanStatus,
  SubscriptionPlans,
  isFreePlanActive,
} from 'src/subscription/config/plans';
import { ConfigService } from '@nestjs/config';
import { NoteDetail } from 'src/notes/schemas/note-detail.schema';
import { Note } from 'src/notes/schemas/note.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(NoteDetail.name) private noteDetailModel: Model<NoteDetail>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
  ) {}
  async getNotes(
    user: any,
    noteType: string,
    page: number,
    limit: number,
    search: string,
  ) {
    try {
      this.isAdminUser(user);
      // Define a filter object to filter notes based on noteType and search keyword
      const filter: any = {};
      if (noteType && noteType !== 'all') {
        filter.type = noteType;
      }
      if (search) {
        filter.patientName = { $regex: new RegExp(search, 'i') }; // Case-insensitive search
      }

      // Calculate skip count to implement pagination
      const skip = (page - 1) * limit;

      // Retrieve notes with pagination and filtering
      const notes = await this.noteModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order

      const noteIds = notes.map((note) => note._id);

      // Retrieve note details for the filtered notes
      const noteDetails = await this.noteDetailModel.find({
        noteId: { $in: noteIds },
      });

      const userIds = notes.map((note) => note.userId);

      // Retrieve user profiles for the filtered notes

      const profiles = await this.profileModel.find({
        userId: { $in: userIds },
      });

      // Map notes with their details
      const notesWithDetails = notes.map((note) => {
        const noteDetail = noteDetails.find(
          (detail) => detail.noteId.toString() === note._id.toString(),
        );
        return {
          ...note.toObject(),
          noteDetail,
        };
      });

      // Map notes with user profiles
      notesWithDetails.forEach((note: any) => {
        const profile: any = profiles.find(
          (profile) => profile.userId.toString() === note.userId.toString(),
        );
        note.profile = profile;
      });

      return notesWithDetails;
    } catch (e) {
      throw new Error('Unable to get notes');
    }
  }

  async getNoteDetails(noteId: string, user: any) {
    try {
      this.isAdminUser(user);
      const note = await this.noteModel.findOne({
        _id: noteId,
      });

      if (!note) throw new Error('Unable to find note');

      const noteDetail = await this.noteDetailModel.findOne({
        noteId: note._id,
      });

      const userDetail = await this.profileModel.findOne({
        userId: note.userId,
      });

      return {
        note,
        noteDetail,
        userDetail,
      };
    } catch (e) {
      throw new Error('Unable to get note details');
    }
  }

  async deleteNote(user: any, noteId: string) {
    try {
      this.isAdminUser(user);
      const note = await this.noteModel.findOne({
        _id: noteId,
      });
      const noteDetail = await this.noteDetailModel.findOne({
        noteId: note._id,
      });

      if (!note) throw new Error('Unable to find note');

      await this.noteModel.deleteOne({
        _id: note._id,
      });
      await this.noteDetailModel.deleteOne({
        _id: noteDetail._id,
      });

      return {
        note,
      };
    } catch (e) {
      throw new Error('Unable to delete note');
    }
  }

  async getUsers(user: any, page: number, limit: number, search: string) {
    try {
      this.isAdminUser(user);
      // Define a filter object to filter notes based on noteType and search keyword
      const filter: any = {
        role: { $ne: 'ADMIN' },
      };
      if (search) {
        filter.fullName = { $regex: new RegExp(search, 'i') }; // Case-insensitive search
      }

      // Calculate skip count to implement pagination
      const skip = (page - 1) * limit;

      // Retrieve notes with pagination and filtering
      const users = await this.profileModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order

      const userIds = users.map((user) => user.userId);
      const notesCount = await this.noteModel.aggregate([
        {
          $match: {
            userId: { $in: userIds },
          },
        },
        {
          $group: {
            _id: '$userId',
            count: { $sum: 1 },
          },
        },
      ]);

      const subscriptionIds = users.map((user) => user.subscriptionId);
      const subscriptions = await this.subscriptionPlanModel.find({
        _id: { $in: subscriptionIds },
      });

      const userWithNotesCount = users.map((user) => {
        const notes = notesCount.find(
          (note) => note._id.toString() === user.userId.toString(),
        );
        return {
          ...user.toObject(),
          notesCount: notes ? notes.count : 0,
        };
      });

      userWithNotesCount.forEach((user: any) => {
        const subscription: any = subscriptions.find(
          (subscription) =>
            subscription._id.toString() === user.subscriptionId.toString(),
        );
        user.subscriptionDetail = subscription;
      });

      return userWithNotesCount;
    } catch (e) {
      throw new Error('Unable to get users');
    }
  }

  async deleteUser(user: any, userId: string) {
    try {
      this.isAdminUser(user);
      const profile = await this.profileModel.findOne({
        userId: userId,
      });
      if (!profile) throw new Error('Unable to find user');

      await this.profileModel.deleteOne({
        userId: profile.userId,
      });

      const noteIds = await this.noteModel.find({
        userId: profile.userId,
      });

      await this.noteModel.deleteMany({
        userId: profile.userId,
      });

      await this.noteDetailModel.deleteMany({
        noteId: { $in: noteIds },
      });

      await this.subscriptionPlanModel.deleteOne({
        _id: profile.subscriptionId,
      });

      return {
        profile,
      };
    } catch (e) {
      console.log(e);
      throw new Error('Unable to delete user');
    }
  }

  async getUserProfile(user: any, userId: string) {
    try {
      this.isAdminUser(user);
      const profile = await this.profileModel.findOne({
        userId: userId,
      });
      const subscription = await this.subscriptionPlanModel.findById(
        profile.subscriptionId,
      );
      const notes = await this.noteModel.count({ userId: userId });
      return {
        profile: profile,
        notesCount: notes,
        subscription,
      };
    } catch (err) {
      throw new Error('Unable to get user profile');
    }
  }

  async isAdminUserCheck(user: any) {
    try {
      const profile = await this.profileModel.findOne({
        userId: user.userId,
      });
      const isAdmin = profile.role === 'ADMIN';
      if (isAdmin) {
        return { isAdmin: true };
      } else {
        return { isAdmin: false };
      }
    } catch (e) {
      throw new InternalServerErrorException('Somthing went wrong');
    }
  }

  private async isAdminUser(user: IUser) {
    try {
      const profile = await this.profileModel.findOne({
        userId: user.userId,
      });
      const isAdmin = profile.role === 'ADMIN';
      if (isAdmin) {
        return true;
      } else {
        throw new ForbiddenException('User is not an admin');
      }
    } catch (e) {
      throw new InternalServerErrorException('Somthing went wrong');
    }
  }
}
