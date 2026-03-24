import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '../database/database.types';

@Injectable()
export class ClerkWebhookService {
  private readonly logger = new Logger(ClerkWebhookService.name);

  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async handleUserCreated(userData: any) {
    try {
      const existingUser = await this.db.user.findOne({
        clerkId: userData.id,
      });
      if (existingUser) return existingUser;

      const email = this.extractPrimaryEmail(userData);
      const username =
        userData.username || userData.first_name || email.split('@')[0];

      return this.db.user.create({
        clerkId: userData.id,
        email,
        username,
      });
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handleUserUpdated(userData: any) {
    try {
      const user = await this.db.user.findOne({ clerkId: userData.id });
      if (!user) {
        this.logger.warn(`User not found for clerkId: ${userData.id}`);
        return;
      }

      const update: Record<string, any> = {};
      const email = this.extractPrimaryEmail(userData);
      if (email) update.email = email;
      if (userData.first_name) update.username = userData.first_name;

      if (Object.keys(update).length > 0) {
        await this.db.user.findByIdAndUpdate(
          (user as any)._id.toString(),
          update,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handleUserDeleted(userData: any) {
    try {
      const user = await this.db.user.findOne({ clerkId: userData.id });
      if (!user) {
        this.logger.warn(`User not found for clerkId: ${userData.id}`);
        return;
      }

      const userId = (user as any)._id.toString();

      await Promise.all([
        this.db.cart.deleteMany({ user: userId }),
        this.db.address.deleteMany({ user: userId }),
        this.db.wishlist.deleteMany({ user: userId }),
        this.db.review.deleteMany({ user: userId }),
        this.db.user.deleteOne({ _id: userId }),
      ]);

      this.logger.log(`User ${userId} and related data deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw error;
    }
  }

  private extractPrimaryEmail(userData: any): string {
    return (
      userData.email_addresses?.find(
        (e: any) => e.id === userData.primary_email_address_id,
      )?.email_address || ''
    );
  }
}
