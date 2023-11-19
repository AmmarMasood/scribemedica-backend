import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { SubscriptionPlanStatus, SubscriptionPlans } from '../config/plans';

@Schema({
  timestamps: true,
})
export class SubscriptionPlan {
  @Prop({ unique: true, required: [true, 'userId is required'] })
  userId: string;

  @Prop({
    required: [true, 'status is required'],
    default: true,
    enum: Object.values(SubscriptionPlanStatus), // Validate against enum values
  })
  status: string;

  @Prop({
    required: [true, 'planId is required'],
    type: String,
    enum: Object.values(SubscriptionPlans), // Validate against enum values
  })
  planId: string;

  // Add a field to store the expiration date of the free plan
  @Prop({
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  }) // 30 days from now
  freePlanExpirationDate: Date;

  @Prop({
    type: String,
  })
  stripeCustomerId: string;

  @Prop({
    type: String,
  })
  stripeSubscriptionId: string;

  @Prop({
    type: String,
  })
  stripePriceId: string;

  @Prop({
    type: Date,
  })
  stripeCurrentPeriodEnd: Date;

  // Virtual property to calculate the days left for the free plan
  get daysLeftForFreePlan(): number {
    const currentDate = new Date();
    const expirationDate = this.freePlanExpirationDate;
    if (currentDate < expirationDate) {
      const timeDiff = expirationDate.getTime() - currentDate.getTime();
      return Math.ceil(timeDiff / (24 * 60 * 60 * 1000)); // Convert milliseconds to days and round up
    } else {
      return 0; // Free plan has expired
    }
  }

  // Virtual property to check if the free plan is active
  get isFreePlanActive(): boolean {
    return (
      this.planId === SubscriptionPlans.FREE &&
      this.status === SubscriptionPlanStatus.ACTIVE &&
      this.daysLeftForFreePlan > 0
    );
  }
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);
