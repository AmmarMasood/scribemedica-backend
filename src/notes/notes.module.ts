import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteSchema } from './schemas/note.schema';
import { NoteDetailSchema } from './schemas/note-detail.schema';
import { ProfileSchema } from 'src/auth/schemas/profile.schema';
import { SubscriptionPlanSchema } from 'src/subscription/schemas/subscription-plan.schema';

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
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
