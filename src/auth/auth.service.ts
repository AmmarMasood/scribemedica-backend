import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './schemas/profile.schema';
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { getNotesBasedOnPlan } from 'src/subscription/config/plans';
import { SubscriptionPlan } from 'src/subscription/schemas/subscription-plan.schema';
import { ProfileUpdateDto } from './dto/updateProfile.dto';
import { Note } from 'src/notes/schemas/note.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    @InjectModel(Note.name) private noteModel: Model<Note>,
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
    @Inject(SubscriptionService)
    private readonly subscriptionService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const { fullName, userId } = registerDto;
      const checkIfUserExist = await this.profileModel.exists({ userId });
      if (checkIfUserExist) {
        return checkIfUserExist;
      }
      const subscription =
        await this.subscriptionService.initalizeFreeSubscription(userId);
      const profile = await this.profileModel.create({
        fullName,
        userId,
        subscriptionId: subscription._id,
        notesAllowed: getNotesBasedOnPlan(subscription.planId),
      });

      return profile;
    } catch (e) {
      console.log(e);
      throw new Error('Unable to register user');
    }
  }

  async getUserProfile(user: any) {
    try {
      const profile = await this.profileModel.findOne({
        userId: user.userId,
      });
      const subscription = await this.subscriptionPlanModel.findById(
        profile.subscriptionId,
      );
      const notes = await this.noteModel.count({ userId: user.userId });
      return {
        profile: profile,
        notesCount: notes,
        subscription,
      };
    } catch (err) {
      throw new Error('Unable to get user profile');
    }
  }

  async updateProfile(user: any, updateDto: ProfileUpdateDto) {
    try {
      const profile = await this.profileModel.findOneAndUpdate(
        { userId: user.userId },
        updateDto,
        { new: true },
      );
      return profile;
    } catch (e) {
      console.log(e);
      throw new Error('Unable to update profile');
    }
  }
}
