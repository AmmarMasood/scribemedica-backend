import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionPlanSchema } from './schemas/subscription-plan.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfileSchema } from 'src/auth/schemas/profile.schema';
import { StripeService } from './config/stripe';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'SubscriptionPlan',
        schema: SubscriptionPlanSchema,
      },
      {
        name: 'Profile',
        schema: ProfileSchema,
      },
    ]),
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, StripeService],
})
export class SubscriptionModule {}
