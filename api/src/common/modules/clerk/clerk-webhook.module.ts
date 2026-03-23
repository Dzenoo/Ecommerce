import { Module } from '@nestjs/common';

import { UserModule } from '@/models/user/user.module';
import { ClerkWebhookController } from './clerk-webhook.controller';
import { ClerkWebhookService } from './clerk-webhook.service';

@Module({
  imports: [UserModule],
  controllers: [ClerkWebhookController],
  providers: [ClerkWebhookService],
  exports: [ClerkWebhookService],
})
export class ClerkWebhookModule {}
