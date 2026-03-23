import {
  Controller,
  Post,
  Req,
  Headers,
  HttpStatus,
  HttpException,
  RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from 'svix';

import { ClerkWebhookService } from './clerk-webhook.service';

@Controller('clerk-webhook')
export class ClerkWebhookController {
  constructor(private readonly clerkWebhookService: ClerkWebhookService) {}

  @Post()
  async handleWebhook(
    @Headers() headers: Record<string, string>,
    @Req() request: RawBodyRequest<Request>,
  ) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET as string;

    const requiredHeaders = ['svix-id', 'svix-timestamp', 'svix-signature'];
    if (!requiredHeaders.every((h) => headers[h])) {
      throw new HttpException(
        'Missing required headers',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = request.rawBody?.toString('utf8') as string;

    try {
      const wh = new Webhook(WEBHOOK_SECRET);
      const response = wh.verify(payload, {
        'svix-id': headers['svix-id'],
        'svix-timestamp': headers['svix-timestamp'],
        'svix-signature': headers['svix-signature'],
      }) as any;

      switch (response.type) {
        case 'user.created':
          await this.clerkWebhookService.handleUserCreated(response.data);
          break;
        case 'user.updated':
          await this.clerkWebhookService.handleUserUpdated(response.data);
          break;
        case 'user.deleted':
          await this.clerkWebhookService.handleUserDeleted(response.data);
          break;
        default:
          console.log(`Unhandled event type: ${response.type}`);
      }

      return { success: true };
    } catch (err) {
      throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
    }
  }
}
