import { Injectable, BadRequestException } from '@nestjs/common';
import {
  SubscriptionPlans,
  SubscriptionPlanStatus,
  getNotesBasedOnPlan,
} from './config/plans';
import { SubscriptionPlan } from './schemas/subscription-plan.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type Stripe from 'stripe';
import { StripeService } from './config/stripe';
import { Profile } from 'src/auth/schemas/profile.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionService {
  private storeSubscriptionPlans: any;

  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
  ) {
    this.storeSubscriptionPlans = [
      {
        id: 'tier1-yearly',
        name: 'Tier 1 Yearly',
        description: '375 notes/month',
        stripePriceId: this.configService.get<string>(
          'STRIPE_TIER_1_YEARLY_PRICE_ID',
        ),
        price: 1200,
      },
      {
        id: 'tier1-monthly',
        name: 'Tier 1 Monthly',
        description: '375 notes/month',
        stripePriceId: this.configService.get<string>(
          'STRIPE_TIER_1_MONTHLY_ID',
        ),
        price: 120,
      },
      {
        id: 'tier2-yearly',
        name: 'Tier 2 Yearly',
        description: '100 notes/month',
        stripePriceId: this.configService.get<string>(
          'STRIPE_TIER_2_YEARLY_PRICE_ID',
        ),
        price: 600,
      },
      {
        id: 'tier2-monthly',
        name: 'Tier 2 Monthly',
        description: '100 notes/month',
        stripePriceId: this.configService.get<string>(
          'STRIPE_TIER_2_MONTHLY_ID',
        ),
        price: 60,
      },
    ];
  }

  async getAllPlans() {
    return this.storeSubscriptionPlans;
  }

  async initalizeFreeSubscription(userId: string) {
    const plan = await this.subscriptionPlanModel.create({
      userId,
      planId: SubscriptionPlans.FREE,
      status: SubscriptionPlanStatus.ACTIVE,
    });
    return plan;
  }

  async handleStripeWebhook(requestBody: any, signature: any): Promise<any> {
    let event: Stripe.Event;
    const stripe = this.stripeService.getStripe();
    try {
      event = stripe.webhooks.constructEvent(
        requestBody,
        signature,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRECT_PROD'),
      );
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session?.metadata?.userId) {
        return {
          status: 200,
        };
      }

      if (event.type === 'checkout.session.completed') {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );

        await this.subscriptionPlanModel.findOneAndUpdate(
          {
            userId: session.metadata.userId,
          },
          {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: session.subscription as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
            planId: session.metadata.planId,
          },
        );

        await this.profileModel.findOneAndUpdate(
          {
            userId: session.metadata.userId,
          },
          {
            notesAllowed: getNotesBasedOnPlan(session.metadata.planId as any),
          },
        );
      }

      if (event.type === 'invoice.payment_succeeded') {
        // Retrieve the subscription details from Stripe.
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        await this.subscriptionPlanModel.findOneAndUpdate(
          {
            stripeSubscriptionId: subscription.id,
          },
          {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000,
            ),
          },
        );
      }

      console.log('============> ', event);

      return {
        status: 'success',
        code: 200,
        message: 'Request succeeded',
      };
    } catch (err) {
      console.log('============> ', err);
      throw new BadRequestException(
        `Webhook Error: ${
          err instanceof Error ? err.message : 'Unknown Error'
        }`,
      );
    }
  }
}