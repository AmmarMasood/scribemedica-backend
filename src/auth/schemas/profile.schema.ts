import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Schema({
  timestamps: true,
})
export class Profile {
  @Prop()
  fullName: string;

  @Prop()
  email: string;

  @Prop({
    unique: true,
    required: [true, 'userId is required'],
  })
  userId: string;

  @Prop({
    type: String,
    enum: Object.values(UserRole), // Validate against enum values
    default: UserRole.USER, // Default value if not provided
  })
  role: string;

  @Prop()
  profession: string;

  @Prop()
  country: string;

  @Prop()
  speciality: string;

  @Prop()
  phoneNumber: string;

  @Prop({ type: 'ObjectId', ref: 'SubscriptionPlan', required: true })
  subscriptionId: ObjectId;

  @Prop()
  notesAllowed: number;

  @Prop()
  notesCreated: number;

  @Prop()
  heardAboutUs: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
