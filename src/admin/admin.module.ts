import { Module } from '@nestjs/common';
import { ProfileSchema } from 'src/auth/schemas/profile.schema';
import { SubscriptionPlanSchema } from 'src/subscription/schemas/subscription-plan.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from 'src/notes/schemas/note.schema';
import { NoteDetailSchema } from 'src/notes/schemas/note-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Note',
        schema: NoteSchema,
      },
      {
        name: 'NoteDetail',
        schema: NoteDetailSchema,
      },
      {
        name: 'Profile',
        schema: ProfileSchema,
      },
      {
        name: 'SubscriptionPlan',
        schema: SubscriptionPlanSchema,
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
