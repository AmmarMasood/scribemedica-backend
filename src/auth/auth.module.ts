import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from './schemas/profile.schema';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { SubscriptionPlanSchema } from 'src/subscription/schemas/subscription-plan.schema';
import { NoteSchema } from 'src/notes/schemas/note.schema';
import { StripeService } from 'src/subscription/config/stripe';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Profile',
        schema: ProfileSchema,
      },
      {
        name: 'SubscriptionPlan',
        schema: SubscriptionPlanSchema,
      },
      {
        name: 'Note',
        schema: NoteSchema,
      },
    ]),
    SubscriptionModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, SubscriptionService, StripeService],
})
export class AuthModule {}
