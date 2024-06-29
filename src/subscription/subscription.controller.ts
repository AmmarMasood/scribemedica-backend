import { Body, Controller, Get, Headers, Post, Req } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { RequestWithRawBody } from 'src/middlewares/rawBody.middleware';

@Controller('/')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('subscription/all')
  async getAllPlans() {
    return await this.subscriptionService.getAllPlans();
  }

  @Post('/webhook')
  async stripeWebhook(
    @Headers('stripe-signature') stripeSignature: string,
    @Req() request: RequestWithRawBody,
  ): Promise<any> {
    return this.subscriptionService.handleStripeWebhook(
      request.rawBody,
      stripeSignature,
    );
  }
}
