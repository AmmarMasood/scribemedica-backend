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

@Injectable()
export class SubscriptionService {
  private storeSubscriptionPlans: any;

  constructor(
    @InjectModel(SubscriptionPlan.name)
    private subscriptionPlanModel: Model<SubscriptionPlan>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
    private readonly stripeService: StripeService,
  ) {
    this.storeSubscriptionPlans = [
      {
        id: 'tier1-yearly',
        name: 'Tier 1 Yearly',
        description: '375 notes/month',
        stripePriceId: process.env.STRIPE_TIER_1_YEARLY_PRICE_ID,
        price: 1200,
      },
      {
        id: 'tier1-monthly',
        name: 'Tier 1 Monthly',
        description: '375 notes/month',
        stripePriceId: process.env.STRIPE_TIER_1_MONTHLY_ID,
        price: 120,
      },
      {
        id: 'tier2-yearly',
        name: 'Tier 2 Yearly',
        description: '100 notes/month',
        stripePriceId: process.env.STRIPE_TIER_2_YEARLY_PRICE_ID,
        price: 600,
      },
      {
        id: 'tier2-monthly',
        name: 'Tier 2 Monthly',
        description: '100 notes/month',
        stripePriceId: process.env.STRIPE_TIER_2_MONTHLY_ID,
        price: 60,
      },
      {
        id: 'unlimited-yearly',
        name: 'Unlimited Yearly',
        description: 'Unlimited notes',
        stripePriceId: process.env.STRIPE_UNLIMITED_YEARLY_PRICE_ID,
        price: 99,
      },
      {
        id: 'unlimited-monthly',
        name: 'Unlimited Monthly',
        description: 'Unlimited notes',
        stripePriceId: process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID,
        price: 9,
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
    console.log(
      '============> WEBHOOK start',
      requestBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRECT_PROD,
    );
    try {
      event = stripe.webhooks.constructEvent(
        requestBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRECT_PROD,
      );
      console.log('============> WEBHOOK event', event);
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('============> WEBHOOK session', session);

      console.log('============> WEBHOOK event', event);
      ``;

      if (event.type === 'customer.subscription.updated') {
        // Handle subscription cancellation

        const subscription = event.data.object as any;

        if (subscription.canceled_at !== null) {
          await this.subscriptionPlanModel.findOneAndUpdate(
            {
              stripeSubscriptionId: subscription.id,
            },
            {
              status: SubscriptionPlanStatus.CANCELLED,
              planId: SubscriptionPlans.FREE,
              freePlanExpirationDate: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000,
              ),
              // Add any other fields you need to update for cancellation
            },
          );
        } else {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string,
          );
          console.log('team here', subscription);

          await this.subscriptionPlanModel.findOneAndUpdate(
            {
              stripeSubscriptionId: subscription.id,
            },
            {
              status: SubscriptionPlanStatus.ACTIVE,
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
      }

      if (!session?.metadata?.userId) {
        return {
          status: 200,
        };
      }

      console.log('============> WEBHOOK  1 session', session);

      console.log('============> WEBHOOK 1 event', event);

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

      if (event.type === 'subscription_schedule.canceled') {
        // Handle subscription cancellation

        const canceledSubscription = event.data.object as any;

        await this.subscriptionPlanModel.findOneAndUpdate(
          {
            stripeSubscriptionId: canceledSubscription.id,
          },
          {
            status: SubscriptionPlanStatus.CANCELLED,
            planId: SubscriptionPlans.FREE,
            freePlanExpirationDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ),
            // Add any other fields you need to update for cancellation
          },
        );
      }

      if (event.type === 'customer.subscription.deleted') {
        // Handle subscription cancellation

        const canceledSubscription = event.data.object as any;

        await this.subscriptionPlanModel.findOneAndUpdate(
          {
            stripeSubscriptionId: canceledSubscription.id,
          },
          {
            status: SubscriptionPlanStatus.CANCELLED,
            planId: SubscriptionPlans.FREE,
            // Add any other fields you need to update for cancellation
          },
        );

        await this.profileModel.findOneAndUpdate(
          {
            userId: session.metadata.userId,
          },
          {
            notesAllowed: getNotesBasedOnPlan(SubscriptionPlans.FREE),
          },
        );
      }

      return {
        status: 'success',
        code: 200,
        message: 'Request succeeded',
      };
    } catch (err) {
      console.log('============> WEBHOOK ERROR', err);
      throw new BadRequestException(
        `Webhook Error: ${
          err instanceof Error ? err.message : 'Unknown Error'
        }`,
      );
    }
  }
}

// # server.rb
// #
// # Use this sample code to handle webhook events in your integration.
// #
// # 1) Paste this code into a new file (server.rb)
// #
// # 2) Install dependencies
// #   gem install sinatra
// #   gem install stripe
// #
// # 3) Run the server on http://localhost:4242
// #   ruby server.rb

// require 'json'
// require 'sinatra'
// require 'stripe'

// # The library needs to be configured with your account's secret key.
// # Ensure the key is kept out of any version control system you might be using.
// Stripe.api_key = 'sk_test_...'

// # This is your Stripe CLI webhook secret for testing your endpoint locally.
// endpoint_secret = 'whsec_753ec06c47b2c5bb7214f8440ac205963060d98d98c5ea58281ae97e282c6094'

// set :port, 4242

// post '/webhook' do
//     payload = request.body.read
//     sig_header = request.env['HTTP_STRIPE_SIGNATURE']
//     event = nil

//     begin
//         event = Stripe::Webhook.construct_event(
//             payload, sig_header, endpoint_secret
//         )
//     rescue JSON::ParserError => e
//         # Invalid payload
//         status 400
//         return
//     rescue Stripe::SignatureVerificationError => e
//         # Invalid signature
//         status 400
//         return
//     end

//     # Handle the event
//     case event.type
//     when 'account.updated'
//         account = event.data.object
//     when 'account.external_account.created'
//         external_account = event.data.object
//     when 'account.external_account.deleted'
//         external_account = event.data.object
//     when 'account.external_account.updated'
//         external_account = event.data.object
//     when 'balance.available'
//         balance = event.data.object
//     when 'billing_portal.configuration.created'
//         configuration = event.data.object
//     when 'billing_portal.configuration.updated'
//         configuration = event.data.object
//     when 'billing_portal.session.created'
//         session = event.data.object
//     when 'capability.updated'
//         capability = event.data.object
//     when 'cash_balance.funds_available'
//         cash_balance = event.data.object
//     when 'charge.captured'
//         charge = event.data.object
//     when 'charge.expired'
//         charge = event.data.object
//     when 'charge.failed'
//         charge = event.data.object
//     when 'charge.pending'
//         charge = event.data.object
//     when 'charge.refunded'
//         charge = event.data.object
//     when 'charge.succeeded'
//         charge = event.data.object
//     when 'charge.updated'
//         charge = event.data.object
//     when 'charge.dispute.closed'
//         dispute = event.data.object
//     when 'charge.dispute.created'
//         dispute = event.data.object
//     when 'charge.dispute.funds_reinstated'
//         dispute = event.data.object
//     when 'charge.dispute.funds_withdrawn'
//         dispute = event.data.object
//     when 'charge.dispute.updated'
//         dispute = event.data.object
//     when 'charge.refund.updated'
//         refund = event.data.object
//     when 'checkout.session.async_payment_failed'
//         session = event.data.object
//     when 'checkout.session.async_payment_succeeded'
//         session = event.data.object
//     when 'checkout.session.completed'
//         session = event.data.object
//     when 'checkout.session.expired'
//         session = event.data.object
//     when 'climate.order.canceled'
//         order = event.data.object
//     when 'climate.order.created'
//         order = event.data.object
//     when 'climate.order.delayed'
//         order = event.data.object
//     when 'climate.order.delivered'
//         order = event.data.object
//     when 'climate.order.product_substituted'
//         order = event.data.object
//     when 'climate.product.created'
//         product = event.data.object
//     when 'climate.product.pricing_updated'
//         product = event.data.object
//     when 'coupon.created'
//         coupon = event.data.object
//     when 'coupon.deleted'
//         coupon = event.data.object
//     when 'coupon.updated'
//         coupon = event.data.object
//     when 'credit_note.created'
//         credit_note = event.data.object
//     when 'credit_note.updated'
//         credit_note = event.data.object
//     when 'credit_note.voided'
//         credit_note = event.data.object
//     when 'customer.created'
//         customer = event.data.object
//     when 'customer.deleted'
//         customer = event.data.object
//     when 'customer.updated'
//         customer = event.data.object
//     when 'customer.discount.created'
//         discount = event.data.object
//     when 'customer.discount.deleted'
//         discount = event.data.object
//     when 'customer.discount.updated'
//         discount = event.data.object
//     when 'customer.source.created'
//         source = event.data.object
//     when 'customer.source.deleted'
//         source = event.data.object
//     when 'customer.source.expiring'
//         source = event.data.object
//     when 'customer.source.updated'
//         source = event.data.object
//     when 'customer.subscription.created'
//         subscription = event.data.object
//     when 'customer.subscription.deleted'
//         subscription = event.data.object
//     when 'customer.subscription.paused'
//         subscription = event.data.object
//     when 'customer.subscription.pending_update_applied'
//         subscription = event.data.object
//     when 'customer.subscription.pending_update_expired'
//         subscription = event.data.object
//     when 'customer.subscription.resumed'
//         subscription = event.data.object
//     when 'customer.subscription.trial_will_end'
//         subscription = event.data.object
//     when 'customer.subscription.updated'
//         subscription = event.data.object
//     when 'customer.tax_id.created'
//         tax_id = event.data.object
//     when 'customer.tax_id.deleted'
//         tax_id = event.data.object
//     when 'customer.tax_id.updated'
//         tax_id = event.data.object
//     when 'customer_cash_balance_transaction.created'
//         customer_cash_balance_transaction = event.data.object
//     when 'entitlements.active_entitlement_summary.updated'
//         active_entitlement_summary = event.data.object
//     when 'file.created'
//         file = event.data.object
//     when 'financial_connections.account.created'
//         account = event.data.object
//     when 'financial_connections.account.deactivated'
//         account = event.data.object
//     when 'financial_connections.account.disconnected'
//         account = event.data.object
//     when 'financial_connections.account.reactivated'
//         account = event.data.object
//     when 'financial_connections.account.refreshed_balance'
//         account = event.data.object
//     when 'financial_connections.account.refreshed_ownership'
//         account = event.data.object
//     when 'financial_connections.account.refreshed_transactions'
//         account = event.data.object
//     when 'identity.verification_session.canceled'
//         verification_session = event.data.object
//     when 'identity.verification_session.created'
//         verification_session = event.data.object
//     when 'identity.verification_session.processing'
//         verification_session = event.data.object
//     when 'identity.verification_session.requires_input'
//         verification_session = event.data.object
//     when 'identity.verification_session.verified'
//         verification_session = event.data.object
//     when 'invoice.created'
//         invoice = event.data.object
//     when 'invoice.deleted'
//         invoice = event.data.object
//     when 'invoice.finalization_failed'
//         invoice = event.data.object
//     when 'invoice.finalized'
//         invoice = event.data.object
//     when 'invoice.marked_uncollectible'
//         invoice = event.data.object
//     when 'invoice.overdue'
//         invoice = event.data.object
//     when 'invoice.paid'
//         invoice = event.data.object
//     when 'invoice.payment_action_required'
//         invoice = event.data.object
//     when 'invoice.payment_failed'
//         invoice = event.data.object
//     when 'invoice.payment_succeeded'
//         invoice = event.data.object
//     when 'invoice.sent'
//         invoice = event.data.object
//     when 'invoice.upcoming'
//         invoice = event.data.object
//     when 'invoice.updated'
//         invoice = event.data.object
//     when 'invoice.voided'
//         invoice = event.data.object
//     when 'invoice.will_be_due'
//         invoice = event.data.object
//     when 'invoiceitem.created'
//         invoiceitem = event.data.object
//     when 'invoiceitem.deleted'
//         invoiceitem = event.data.object
//     when 'issuing_authorization.created'
//         issuing_authorization = event.data.object
//     when 'issuing_authorization.updated'
//         issuing_authorization = event.data.object
//     when 'issuing_card.created'
//         issuing_card = event.data.object
//     when 'issuing_card.updated'
//         issuing_card = event.data.object
//     when 'issuing_cardholder.created'
//         issuing_cardholder = event.data.object
//     when 'issuing_cardholder.updated'
//         issuing_cardholder = event.data.object
//     when 'issuing_dispute.closed'
//         issuing_dispute = event.data.object
//     when 'issuing_dispute.created'
//         issuing_dispute = event.data.object
//     when 'issuing_dispute.funds_reinstated'
//         issuing_dispute = event.data.object
//     when 'issuing_dispute.submitted'
//         issuing_dispute = event.data.object
//     when 'issuing_dispute.updated'
//         issuing_dispute = event.data.object
//     when 'issuing_token.created'
//         issuing_token = event.data.object
//     when 'issuing_token.updated'
//         issuing_token = event.data.object
//     when 'issuing_transaction.created'
//         issuing_transaction = event.data.object
//     when 'issuing_transaction.updated'
//         issuing_transaction = event.data.object
//     when 'mandate.updated'
//         mandate = event.data.object
//     when 'payment_intent.amount_capturable_updated'
//         payment_intent = event.data.object
//     when 'payment_intent.canceled'
//         payment_intent = event.data.object
//     when 'payment_intent.created'
//         payment_intent = event.data.object
//     when 'payment_intent.partially_funded'
//         payment_intent = event.data.object
//     when 'payment_intent.payment_failed'
//         payment_intent = event.data.object
//     when 'payment_intent.processing'
//         payment_intent = event.data.object
//     when 'payment_intent.requires_action'
//         payment_intent = event.data.object
//     when 'payment_intent.succeeded'
//         payment_intent = event.data.object
//     when 'payment_link.created'
//         payment_link = event.data.object
//     when 'payment_link.updated'
//         payment_link = event.data.object
//     when 'payment_method.attached'
//         payment_method = event.data.object
//     when 'payment_method.automatically_updated'
//         payment_method = event.data.object
//     when 'payment_method.detached'
//         payment_method = event.data.object
//     when 'payment_method.updated'
//         payment_method = event.data.object
//     when 'payout.canceled'
//         payout = event.data.object
//     when 'payout.created'
//         payout = event.data.object
//     when 'payout.failed'
//         payout = event.data.object
//     when 'payout.paid'
//         payout = event.data.object
//     when 'payout.reconciliation_completed'
//         payout = event.data.object
//     when 'payout.updated'
//         payout = event.data.object
//     when 'person.created'
//         person = event.data.object
//     when 'person.deleted'
//         person = event.data.object
//     when 'person.updated'
//         person = event.data.object
//     when 'plan.created'
//         plan = event.data.object
//     when 'plan.deleted'
//         plan = event.data.object
//     when 'plan.updated'
//         plan = event.data.object
//     when 'price.created'
//         price = event.data.object
//     when 'price.deleted'
//         price = event.data.object
//     when 'price.updated'
//         price = event.data.object
//     when 'product.created'
//         product = event.data.object
//     when 'product.deleted'
//         product = event.data.object
//     when 'product.updated'
//         product = event.data.object
//     when 'promotion_code.created'
//         promotion_code = event.data.object
//     when 'promotion_code.updated'
//         promotion_code = event.data.object
//     when 'quote.accepted'
//         quote = event.data.object
//     when 'quote.canceled'
//         quote = event.data.object
//     when 'quote.created'
//         quote = event.data.object
//     when 'quote.finalized'
//         quote = event.data.object
//     when 'quote.will_expire'
//         quote = event.data.object
//     when 'radar.early_fraud_warning.created'
//         early_fraud_warning = event.data.object
//     when 'radar.early_fraud_warning.updated'
//         early_fraud_warning = event.data.object
//     when 'refund.created'
//         refund = event.data.object
//     when 'refund.updated'
//         refund = event.data.object
//     when 'reporting.report_run.failed'
//         report_run = event.data.object
//     when 'reporting.report_run.succeeded'
//         report_run = event.data.object
//     when 'review.closed'
//         review = event.data.object
//     when 'review.opened'
//         review = event.data.object
//     when 'setup_intent.canceled'
//         setup_intent = event.data.object
//     when 'setup_intent.created'
//         setup_intent = event.data.object
//     when 'setup_intent.requires_action'
//         setup_intent = event.data.object
//     when 'setup_intent.setup_failed'
//         setup_intent = event.data.object
//     when 'setup_intent.succeeded'
//         setup_intent = event.data.object
//     when 'sigma.scheduled_query_run.created'
//         scheduled_query_run = event.data.object
//     when 'source.canceled'
//         source = event.data.object
//     when 'source.chargeable'
//         source = event.data.object
//     when 'source.failed'
//         source = event.data.object
//     when 'source.mandate_notification'
//         source = event.data.object
//     when 'source.refund_attributes_required'
//         source = event.data.object
//     when 'source.transaction.created'
//         transaction = event.data.object
//     when 'source.transaction.updated'
//         transaction = event.data.object
//     when 'subscription_schedule.aborted'
//         subscription_schedule = event.data.object
//     when 'subscription_schedule.canceled'
//         subscription_schedule = event.data.object
//     when 'subscription_schedule.completed'
//         subscription_schedule = event.data.object
//     when 'subscription_schedule.created'
//         subscription_schedule = event.data.object
//     when 'subscription_schedule.expiring'
//         subscription_schedule = event.data.object
//     when 'subscription_schedule.released'
//         subscription_schedule = event.data.object
//     when 'subscription_schedule.updated'
//         subscription_schedule = event.data.object
//     when 'tax.settings.updated'
//         settings = event.data.object
//     when 'tax_rate.created'
//         tax_rate = event.data.object
//     when 'tax_rate.updated'
//         tax_rate = event.data.object
//     when 'terminal.reader.action_failed'
//         reader = event.data.object
//     when 'terminal.reader.action_succeeded'
//         reader = event.data.object
//     when 'test_helpers.test_clock.advancing'
//         test_clock = event.data.object
//     when 'test_helpers.test_clock.created'
//         test_clock = event.data.object
//     when 'test_helpers.test_clock.deleted'
//         test_clock = event.data.object
//     when 'test_helpers.test_clock.internal_failure'
//         test_clock = event.data.object
//     when 'test_helpers.test_clock.ready'
//         test_clock = event.data.object
//     when 'topup.canceled'
//         topup = event.data.object
//     when 'topup.created'
//         topup = event.data.object
//     when 'topup.failed'
//         topup = event.data.object
//     when 'topup.reversed'
//         topup = event.data.object
//     when 'topup.succeeded'
//         topup = event.data.object
//     when 'transfer.created'
//         transfer = event.data.object
//     when 'transfer.reversed'
//         transfer = event.data.object
//     when 'transfer.updated'
//         transfer = event.data.object
//     # ... handle other event types
//     else
//         puts "Unhandled event type: #{event.type}"
//     end

//     status 200
// end
